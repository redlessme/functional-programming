{-# LANGUAGE DuplicateRecordFields #-}
{-# LANGUAGE NamedFieldPuns #-}
module OhTypes
  (Suit (..), Rank (..),
   PlayerId, PlayerError(..), BidFunc, PlayFunc,
   Card (Card), Deck (..), Player (..), Play, Trick, Hand (..),
   HandScore (..), HandResult (..), GameScore (..), GameResult (..), Place(..))
where

data Suit = Spade|Club|Diamond|Heart
  deriving (Eq,Ord,Enum,Bounded)

instance Show Suit where
  show Spade = "^"
  show Club = "&"
  show Diamond = "O"
  show Heart = "V"

data Rank = Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Jack|Queen|King|Ace
  deriving (Eq,Ord,Enum,Show,Bounded)

data Card = Card Suit Rank
  deriving (Eq, Ord, Show)

-- | We deal each hand from a new deck
-- hands can be any size as long as we have
-- enough cards in the deck for each player
data Deck = Deck {
  handSize::Int,
  deck::[Card]
}

-- |Play function type
-- Cards are added to each trick from the front.
-- Thus, the first-played card in a trick is the last in its list of cards
-- The lead suit is the suit of the first-played card in the trick.
-- A play is only legal if it does not reneg on the lead suit.
-- That is, the player must play a card of the suit led if they have it.
-- The winner is the highest trump card (if any were legally played),
-- or, if no trumps were played, the highest card in the lead suit.
type PlayFunc
  =  PlayerId     -- ^ this player's Id so they can identify themselves in the bids and tricks
  -> [Card]       -- ^ the player's cards
  -> [(PlayerId,Int)]-- ^ all players' bids
  -> Card         -- ^ trump card
  -> [Trick]      -- ^ tricks played so far
  -> Trick        -- ^ cards in the current trick so far
  -> Card         -- ^ the player's chosen card

-- |Bid function type
-- must respect hook rule:
-- last bidder cannot bid an amount that sums to the number of tricks available
type BidFunc
  = Card    -- ^ trump card
  -> [Card] -- ^ list of cards in the player's hand
  -> Int    -- ^ number of players
  -> [Int]  -- ^ bids so far
  -> Int    -- ^ the number of tricks the player intends to win

type PlayerId = String
type Play = (Card, PlayerId)
type Trick = [Play]

data PlayerError = RenegError PlayerId String
                 | InvalidCardError PlayerId String
                 | BidError PlayerId String
                 | TimeError PlayerId String
  deriving Show

data Player = Player {
  playerId::PlayerId,
  playFunc::PlayFunc,
  bidFunc::BidFunc,
  elo::Float,
  gamesPlayed::Int
}
instance Eq Player where
  Player{playerId=a} == Player{playerId=b} = a == b

instance Show Player where
  show Player{playerId,elo,gamesPlayed} = "Player: " ++ show playerId
                                        ++", games played: " ++ show gamesPlayed
                                        ++", elo: " ++ show elo

data Hand = Hand {
  player::Player,
  cards::[Card],
  bid::Int
}
data HandScore = HandScore {
  playerId::PlayerId,
  bid::Int,
  won::Int,
  score::Int
} deriving Show

data HandResult = HandResult {
  trumpCard::Card,
  tricks::[Trick],
  scores::[HandScore]
}

data GameScore = GameScore {
  playerId::PlayerId,
  finalScore::Int,
  underBid::Int,
  overBid::Int
} deriving (Show,Eq,Ord)

data Place = Place {
  playerId::PlayerId,
  place::Int,
  eloPre::Float
} deriving (Show)

data GameResult = GameResult {
  hands::[HandResult],
  gameScore::[GameScore],
  places::[Place],
  updatedPlayers::[Player]
}
