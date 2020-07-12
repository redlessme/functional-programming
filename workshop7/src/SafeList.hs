-- | Implementation of "safe" list procedures.
module SafeList (
  head
  , tail
  , sum
  ) where

import Prelude hiding (head, tail, sum)

-- | @head@ returns the first element of a list if the list is not empty.
--
-- >>> head []
-- Nothing
--
-- >>> head [1]
-- Just 1
--
-- >>> head [1..10]
-- Just 1
head::[a]->Maybe a
head []=Nothing
head (h:_)=Just h

-- | @tail@ returns a list without its first element if the list is not empty.
--
-- >>> tail []
-- Nothing
--
-- >>> tail [1]
-- Just []
--
-- >>> tail [1..10]
-- Just [2,3,4,5,6,7,8,9,10]
tail::[a]->Maybe [a]
tail []=Nothing
tail(h:[])=Just []
tail(h:t)=Just t

-- | @sum@ sums the elements of a list if the list is not empty (a sum equals to
-- zero means that there __are__ elements in the list).
--
-- >>> sum []
-- Nothing
--
-- >>> sum [1]
-- Just 1
--
-- >>> sum [1..10]
-- Just 55

mySum::(Num a)=>[a]->a
mySum []=0
mySum (x:xs)=x+mySum(xs)
sum:: (Num a)=>[a]->Maybe a
sum []=Nothing
sum (x:xs)=Just $ mySum(x:xs)



