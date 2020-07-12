module Player (
    playCard,
    makeBid
)
where
{-

The strategy of my bid is if I am the first one to bid, just bid 1,
    else if the hand size is greater than 5 and someone's bid is greater than 3, it means someone has very good cards
     in hand, which is hard to beat him then I just bid 0.
     else if hand size is smaller than or equal to 5, if someone's bid is larger than 2, then I bid 0.
     otherwise, my bid is equal to the number of large trump(>Six) in my hand plus the number of non-trump Ace 
     in my hand.
     The bid I guess need to obey hook rule, so finally, I put my bid into a hook function, if my bid does not obey
    the hook rule, just let my bid plus one. 
The strategy of play card is if my current score is smaller than my bid, I try to win by play high rank card
    if my socre is larger than or equal to my bid, I try to loose by play low rank card.
    If trick is empty , I just play a low rank card.
    else if trick is not empty, if there are lead cards in my hand and my score is lower than my bid and there is trump in
    trick, I just play a low rank card, because it is hard to beat trump card. 
    but if no trump in trick ,I can try to play the highest rank lead suit card to win this trick.
    If no lead in hand, then if I want to win and I have trump in hand, I just play the hignest rank trump.
    if No trumo in hand, I just play the highest rank card in hand
    else if I want to loose, I just play the lowest rank card in my hand.
The way I use functional programming principles from the lectures and course notes:
I use guard in guessBid and hook function
I use any and map to check if there is a trump in a trick list
I use filter to find myBid, leadSuitCards and trumpCards
I use constructor to find the value I want get.
-}
import OhTypes
import OhHell
-- Find the lead suit in a trick
leadSuit1 :: Trick -> Suit  
leadSuit1 cards1 = 
    let (Card suit _, _) = last cards1 
    in suit
--check if bid obeys hook rule, if not ,add 1 to bid
hook::[Int]->Int->Int->Int->Int
hook bids bid1 num1 handSize1
    |length bids==num1-1 && bid1+sum bids==handSize1=bid1+1
    |otherwise=bid1
--get rank of a card
getRank :: Card -> Rank
getRank (Card _ rank)=rank
--get suit of a card
getSuit :: Card-> Suit
getSuit (Card suit _)=suit
--check if there is trump in a trick
trumpInTrick::Suit->Trick->Bool
trumpInTrick trumpSuit trick = any (trumpSuit==) (map (\(Card suit _, _) ->suit ) trick)
--caculate my bid in tricks so far
myBid::PlayerId->[(PlayerId,Int)]->Int
myBid pId allPlayerBids=snd $ maximum $ filter ((pId==) . fst) allPlayerBids  
--find lead suit cards in hand
--rerteun a list of leadsuit cards in hand
leadSuitCards::Suit->[Card]->[Card] 
leadSuitCards ledSuit hands1=filter((ledSuit==) . getSuit) hands1 
--find trump suit cards in hand
--return a lsit of trump cards in hand 
trumpCards::Suit->[Card]->[Card] 
trumpCards trumpSuit hands1=filter ((trumpSuit==) . getSuit) hands1  

-- | Play a card for the current trick.
-- If you are the "lead" player, you must follow the suit of the card that was led.
playCard :: PlayFunc
playCard pId hands1 allPlayerBids (Card tSuit _) tricksSoFar trick = 
    let
        ledSuit=leadSuit1 trick        
        trumpSuit=tSuit         
        curr_score= foldl (+) 0 (map getScore tricksSoFar) --my current score
        --caculte my score in tricks so far
        getScore tricksSoFar1
            |winner trumpSuit tricksSoFar1 ==pId =1
            |otherwise=0
    in     
        if null trick --if trick is empty
            then minimum hands1
        else --if trick is not empty
            if not $ null $ leadSuitCards ledSuit hands1 --if no lead suit card in hand
                then if curr_score < myBid pId allPlayerBids --try to loose
                    then if trumpInTrick trumpSuit trick --if there is trump in trick
                        then minimum $leadSuitCards ledSuit hands1 --play minimum lead suit card in hand
                    else maximum $ leadSuitCards ledSuit hands1  --play maximum lead suit card in hand
                else minimum $ leadSuitCards ledSuit hands1     --play minimum lead suit card in hand
            else if curr_score < myBid pId allPlayerBids --try to win
                then if not $ null $ trumpCards trumpSuit hands1 then maximum $ trumpCards trumpSuit hands1 --if there is trump in hand, play highest rank trump in hand
                else maximum hands1 
            else minimum hands1  
 
-- | Bid the number of cards you can win based on the trump card and your hand.
--   last player to bid must obey "hook rule":
--   sum of bids must not equal number of tricks available

makeBid :: BidFunc
makeBid (Card tSuit _) hand num bidSoFar =hook bidSoFar bid1 num handSize1
    where    
        highestBid=minimum bidSoFar
        trumpSuit = tSuit
        handSize1 = length hand
        bid1 = guessBid 
        --find all trump cards that are greater 6 in hand
        trumpBids []=0 
        trumpBids (x:xs) = if getRank x>Six && getSuit x==trumpSuit then 1+trumpBids xs else trumpBids xs
        --find all non-trump cards that rank are Ace
        aceBids []=0
        aceBids (x:xs) = if getRank x==Ace && getSuit x /=trumpSuit then 1+aceBids xs else aceBids xs 
        --according to these information,guess a bid
        guessBid 
            |null bidSoFar =1
            |handSize1>5 && highestBid > 3 =0
            |handSize1<=5 && highestBid>2 =0
            |otherwise=trumpBids hand + (aceBids hand) 