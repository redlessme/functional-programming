{-# LANGUAGE DuplicateRecordFields #-}
{-# LANGUAGE NamedFieldPuns #-}
{-# LANGUAGE Trustworthy #-}
module OhHell
  ( allHands, minHand, maxHand,
    sortedDeck, shuffledDeck, shuffleList,
    deal, newPlayer, winner,
    bidSize, hookRule, reneging,
    playHand, playGame, initElo
  ) where

import System.Random
import System.Timeout
import Control.Monad
import Data.Foldable
import Data.List
import Data.Monoid
import Data.Maybe (fromMaybe)
import Logs(writeHand)
import OhTypes
import EitherIO

instance Show HandResult where
  show (HandResult (Card trumpSuit _) tricks scores) = unlines $
    ("trump suit: " ++ show trumpSuit)
    : map showTrick (reverse tricks) ++ map show scores
    where
    showTrick cards = show (reverse cards) ++ ", winner: " ++ winner trumpSuit cards

sortedDeck :: [Card]
sortedDeck = Card <$> [Spade ..] <*> [Two ..]

minHand :: Int
minHand = 3

-- maxHand size is 12 meaning that for four players we deal at most 12*4 = 48 cards
-- leaving several cards from which to choose a trump
maxHand :: Int
maxHand = 12

-- | All possible hand sizes for four players
allHands :: [Int]
allHands = asc ++ desc
  where
    asc = [minHand..maxHand]
    (_: desc) = reverse asc

shuffleList :: [a] -> IO [a]
shuffleList l = do
  i <- replicateM (length l) (randomIO :: IO Int)
  return $ map snd $ sortOn fst $ zip i l

shuffledDeck :: IO [Card]
shuffledDeck = shuffleList sortedDeck

newPlayer :: PlayerId -> PlayFunc -> BidFunc -> Player
newPlayer playerId play bid = Player playerId play bid initElo 0

initElo :: Float
initElo = 1200

-- | sum hand scores for each player
sumScoresByPlayer
  :: [HandScore] -- ^ results of each hand
  -> [GameScore] -- ^ total scores for each player
sumScoresByPlayer =
  let metrics (HandScore _ b w s) =
        let diff x y = if x>y then x-y else 0
        in (Sum s, Sum (diff w b), Sum (diff b w))
      playerGameScore [] = error "Hand results cannot be empty"
      playerGameScore l@(HandScore i _ _ _:_) =
        let (Sum s,Sum u,Sum o) = (mconcat . map metrics) l
        in GameScore i s u o
      fPlayerId = playerId::HandScore->PlayerId
  in  map playerGameScore
      . groupBy (sameField fPlayerId)
      . sortOn fPlayerId

sameField :: Eq a => (t -> a) -> t -> t -> Bool
sameField f a b = f a == f b

placesFromGameScores
  :: [Player]
  -> [GameScore]
  -> [Place]
placesFromGameScores players =
  let getElo i = fromMaybe initElo $ elo <$> find (\Player{playerId=pid}->pid == i) players
      makePlace place GameScore{playerId} = Place playerId place (getElo playerId)
  in
  concatMap (\(p,s)->map (makePlace p) s)
  . zip [1..]
  . groupBy (sameField finalScore)
  . reverse
  . sortOn finalScore

-- https://github.com/qwhex/multi_elo/blob/master/multi_elo.py
computeEloChanges :: [Place] -> [Float]
computeEloChanges places = map calcElo places
  where n = fromIntegral $ length places
        k = 32.0 / (n-1.0)
        calcElo Place{playerId=pid, place=pPlace, eloPre=pElo} =
          let opponents = filter (\Place{playerId=oid} -> oid /= pid) places
              calcS oPlace
                | pPlace < oPlace = 1.0
                | pPlace == oPlace = 0.5
                | otherwise = 0
              calcEA oElo = 1.0 / (1.0 + 10.0 ** ((oElo - pElo)/400.0))
              opponentEloContrib o = let s = calcS (place o)
                                         ea = calcEA (eloPre o)
                                     in k * (s-ea)
          in sum $ map opponentEloContrib opponents

-- | Play a hand of a given size
playDeck :: [Player] -> Deck -> EitherIO PlayerError HandResult
playDeck players (Deck handSize deck) = playHand handSize rotatedPlayers deck
  where
    rotateList i l = take (length l) $ drop i $ cycle l
    rotatedPlayers = rotateList handSize players

-- | Update a player with a new game
updatePlayer :: Player -> Float -> Player
updatePlayer p@Player{gamesPlayed=oldGames,elo=oldElo} eloChange =
  p{gamesPlayed = succ oldGames, elo=oldElo + eloChange}

-- |Play out a full game
playGame
  :: [Player] -- ^ a list of players
  -> [Deck]   -- ^ a deck for each hand
  -> EitherIO PlayerError GameResult
  -- ^ played-out hand results, scores and places for each player and
  -- players with updated elos
playGame players decks = do
  played <- traverse (playDeck players) decks
  let results = sumScoresByPlayer $ concatMap scores played
      places = placesFromGameScores players results
      elosById = map snd $ sort
                 $ zip (map (playerId::Place->PlayerId) places)
                 $ computeEloChanges places
      playersById = sortOn (playerId::Player->PlayerId) players
      updatedPlayers = reverse $ sortOn elo $ zipWith updatePlayer playersById elosById
  return $ GameResult played results places updatedPlayers

-- |deal n cards each to m players
deal :: Int -> Int -> [Card] -> [[Card]]
deal n m = take m . map (take n) . iterate (drop n)

-- | Verify that the bids are of the right size.
bidSize
  :: Int                        -- ^ Bid by player
  -> Int                        -- ^ Size of the current hand
  -> Bool
bidSize bid handSize = bid >= 0 && bid <= handSize

-- | Hook rule: the sum of the bids cannot be equal to the total
-- number of cards to play.
hookRule
  :: [Int]                      -- ^ Bids
  -> Int                        -- ^ Number of players
  -> Int                        -- ^ Size of the hands
  -> Bool
hookRule bids playerCount handSize
  | length bids < playerCount = True
  | otherwise = sum bids /= handSize

-- |gather bids from players for their respective hands
bidding
  :: [Player] -- ^ the players with their bid functions
  -> Card     -- ^ trump card
  -> [[Card]] -- ^ a hand of cards for each player
  -> Either PlayerError [Int] -- ^ the bids for each player
bidding players trumpCard hands = foldrM addBid [] $ zip players hands
  where
    getBid Player{bidFunc, playerId} hand bids =
      let numPlayers = length players
          bid = bidFunc trumpCard hand numPlayers bids
      in if bidSize bid (length hand)
         then return bid
         else Left $ BidError playerId "Cannot bid less than 0 or more than cards in hand"
    addBid (player, hand) bids = do
      bid <- getBid player hand bids
      return $ bid : bids

-- | deal n cards to the given players and collect their bids
dealAndBid :: Int -> [Player] -> [Card] -> Either PlayerError (Card, [Hand])
dealAndBid n players deck = do
  let trumpCard:restDeck = deck
  let hands = deal n (length players) restDeck
  bids <- bidding players trumpCard hands
  if hookRule bids (length players) n
  then return (trumpCard, zipWith3 Hand players hands bids)
  else
    let Player{playerId} = head players
    in Left $ BidError playerId "Bids must not sum to hand size"

leadSuit :: Trick -> Suit
leadSuit cards = let (Card suit _, _) = last cards in suit

-- | the winner of a trick is the highest-ranked card of the trump suit
-- or the highest ranked card of the lead suit
winner :: Suit -> Trick -> PlayerId
winner trumpSuit playedCards =
  let
    cardSuit (Card suit _, _) = suit
    cardsOfSuit suit = filter ((suit==) . cardSuit) playedCards
    ledSuit = leadSuit playedCards
    trumpCards = cardsOfSuit trumpSuit
    ledSuitCards = cardsOfSuit ledSuit
  in
    if not $ null trumpCards
    then snd $ maximum trumpCards
    else snd $ maximum ledSuitCards

-- | Call player's chooseCard function, with a timer
chooseCard
  :: Hand                       -- ^ Current hand
  -> [(PlayerId, Int)]          -- ^ Bids
  -> Card                       -- ^ Trump
  -> [Trick]                    -- ^ Previous tricks in hand
  -> Trick                      -- ^ Current trick
  -> EitherIO PlayerError (Play, Hand)
chooseCard hand bids trumpCard tricksSoFar trick = do
  played <- EitherIO card
  liftEither (process played hand trick)
  where
    (Hand Player{playerId,playFunc} handCards _) = hand
    picked = playFunc playerId handCards bids trumpCard tricksSoFar trick
    card = do
      played <- timeout 1000 $ return picked
      let timed = case played of
            Nothing -> Left $ TimeError playerId "took too long to play."
            Just c -> Right c
      return timed


-- | Tell if a player renegs (does not follow suit)
reneging
  :: Card                       -- ^ Card played
  -> [Card]                     -- ^ Cards in hand
  -> Suit                       -- ^ Led suit
  -> [Card]                     -- ^ Current trick
  -> Bool
reneging _ _ _ [] = False
reneging (Card suit _) hand ledSuit _ =
  suit /= ledSuit && any followSuit hand
  where
    followSuit (Card s _) = s == ledSuit

process :: Card -> Hand -> Trick -> Either PlayerError (Play, Hand)
process card@(Card _ _) (Hand p@Player{playerId} handCards bid) trick
  | reneging card handCards ledSuit trickCards = Left renegError
  | card `notElem` handCards = Left invalidCardError
  | otherwise = Right ((card, playerId), newHand)
  where
    trickCards = map fst trick
    (Card ledSuit _) = last trickCards
    newHand = Hand p (delete card handCards) bid
    renegError =
      RenegError playerId $ "didn't follow led suit: " ++ show ledSuit
    invalidCardError =
      InvalidCardError playerId $
        "Card played wasn't in player's hand: " ++ show card ++
        "Hand: " ++ show handCards

-- | Choose and move card from hand to trick
playCardToTrick
  :: [(PlayerId, Int)]          -- ^ Bids
  -> Card                       -- ^ Trump
  -> [Trick]                    -- ^ Tricks played in previous rounds
  -> Hand                       -- ^ Player hand
  -> EitherIO PlayerError (Trick, [Hand])
  -> EitherIO PlayerError (Trick, [Hand])
playCardToTrick bids trump tricksSoFar hand stateOfPlay = do
  (trick, playedHands) <- stateOfPlay
  (p, h) <- chooseCard hand bids trump tricksSoFar trick
  return (p:trick, h:playedHands)

-- | Rotate hands to move the specified player into the lead position
-- player order is tail of list goes first
rotateHands :: PlayerId -> [Hand] -> [Hand]
rotateHands pid hs =
  let rhands = reverse hs in
  case findIndex (\Hand{player=Player{playerId}}->pid == playerId) rhands of
    Just p -> let (a,b) = splitAt p rhands
              in reverse $ b ++ a
    _ -> error "unknown player"

-- | Play a trick, in case of an illegal play the guilty player is
-- identified, otherwise return played-out trick and the remaining
-- hands, rotated so that the winner is in lead position
playTrick ::
  Card                          -- ^ trump card
  -> [Hand]                     -- ^ hands in play order
  -> [Trick]                    -- ^ tricks played so far
  -> EitherIO PlayerError (Trick,[Hand])
playTrick trumpCard@(Card trumpSuit _) hands tricksSoFar = do
  (trick, playerHands) <- foldr playCards (return ([],[])) hands
  return (trick, rotateHands (winner trumpSuit trick) playerHands)
  where
    bids = map (\(Hand Player{playerId} _ bid)->(playerId,bid)) hands
    playCards = playCardToTrick  bids trumpCard tricksSoFar

-- | Play tricks for the given hands until no cards remaining in
-- hands. Returns the played out tricks or an error.
playTricks
  :: Card                       -- ^ trumpCard
  -> [Hand]                     -- ^ remaining hands for each player
  -> [Trick]                    -- ^ tricks played so far
  -> EitherIO PlayerError [Trick]
playTricks _ (Hand { cards=[] } : _) tricksSoFar = return tricksSoFar
playTricks trumpCard hands tricksSoFar = do
  (trick, newHands) <- playTrick trumpCard hands tricksSoFar
  playTricks trumpCard newHands (trick: tricksSoFar)

isPlayer :: PlayerId -> (PlayerId, Int) -> Bool
isPlayer = (.fst).(==)

-- |Get counts of tricks won by each player
tallyTricks
  :: Suit -- ^ trump suit
  -> [Trick] -- ^ played-out tricks
  -> [(PlayerId, Int)] -- ^ how many tricks each player has won
tallyTricks trumpSuit = foldl doTrick []
  where doTrick tally trick
          = let w = winner trumpSuit trick
                isWinner = isPlayer w
            in case find isWinner tally of
              Just(_,prevScore) -> (w,prevScore+1):filter (not.isWinner) tally
              Nothing -> (w,1):tally

-- | If the player won the number bid then they receive 10 + bid
-- otherwise 0
calculateHandScores :: [(PlayerId, Int)] -> [Hand] -> [HandScore]
calculateHandScores trickTally = map matchBid
  where
    matchBid (Hand Player{playerId=pid} _ bid) =
      let (_,won) = fromMaybe (pid,0) $ find (isPlayer pid) trickTally
      in HandScore pid bid won $ if won == bid then 10 + bid else 0

playHand :: Int -> [Player] -> [Card] -> EitherIO PlayerError HandResult
playHand handSize players deck = do
  (trumpCard, hands) <- liftEither $ dealAndBid handSize players deck
  played <- pureHand trumpCard hands
  liftIO $ writeHand players played
  return played

-- | Play a hand
pureHand
  :: Card                       -- ^ Trump card
  -> [Hand]                     -- ^ Player hands
  -> EitherIO PlayerError HandResult
  -- ^ the played out tricks and resulting scores for each player
pureHand trumpCard hands = do
  tricks <- playTricks trumpCard hands []
  let (Card trumpSuit _) = trumpCard
      scores = calculateHandScores (tallyTricks trumpSuit tricks) hands
  return (HandResult trumpCard tricks scores)
