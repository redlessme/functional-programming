module Player (
    playCard,
    makeBid
)
where
{-
Write a report describing your design and strategy here.
-}
import OhTypes
import OhHell

-- leadSuit1 :: Trick -> Suit
-- leadSuit1 cards = 
--     let (Card suit _, _) = last cards 
--     in suit

-- hook::[Int]->Int->Int->Int->Int
-- hook bids bid1 num1 handSize1
--     |length bids==num1-1 && bid1+sum bids==handSize1=bid1+1
--     |otherwise=bid1

-- getRank :: Card -> Rank
-- getRank (Card _ rank)=rank

-- getSuit :: Card-> Suit
-- getSuit (Card suit _)=suit

-- | Play a card for the current trick.
-- If you are the "lead" player, you must follow the suit of the card that was led.
playCard :: PlayFunc
playCard=undefined
-- playCard pId hands allPlayerBids (Card tSuit _) tricksSoFar trick = 
--     let
--         ledSuit=leadSuit1 trick 
--         leadSuitCards=filter((ledSuit==) . getSuit) hands --rerteun a list of leadsuit cards in hand
--     in 
--         if not $ null trick--trick is not empty
--             then if not $ null leadSuitCards --if there are leadSuitCard  and greater than all people,play it,else play minimum card
--                 then head leadSuitCards
--             else
--                 head hands
--         else
--             head hands
       
-- | Bid the number of cards you can win based on the trump card and your hand.
--   last player to bid must obey "hook rule":
--   sum of bids must not equal number of tricks available

makeBid :: BidFunc
makeBid=undefined
-- makeBid (Card tSuit _) hand num bidSoFar =hook bidSoFar bid num handSize
--     where    
--         highestBid=minimum bidSoFar
--         trumpSuit = tSuit

--         handSize=length hand
--         bid=guessBid 
--         --find all trump cards that are greater 6 in hand
--         trumpBids []=0 
--         trumpBids (x:xs) = if getRank x>Six && getSuit x==trumpSuit then 1+trumpBids xs else trumpBids xs
--         --find all non-trump cards that rank are Ace
--         aceBids []=0
--         aceBids (x:xs) = if getRank x==Ace && getSuit x /=trumpSuit then 1+aceBids xs else aceBids xs 
--         --according to these information,guess a bid
--         guessBid 
--             |handSize>5 && highestBid > 3 =0
--             |handSize<=5 && highestBid>2 =0
--             |otherwise=trumpBids hand + (aceBids hand) 










