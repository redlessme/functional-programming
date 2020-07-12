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

-- | Play a card for the current trick.
-- If you are the "lead" player, you must follow the suit of the card that was led.
playCard :: PlayFunc
playCard = undefined

-- | Bid the number of cards you can win based on the trump card and your hand.
--   last player to bid must obey "hook rule":
--   sum of bids must not equal number of tricks available
makeBid :: BidFunc
makeBid = undefined