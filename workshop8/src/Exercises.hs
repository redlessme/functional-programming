module Exercises where

import Base
import Applicative
import Prelude hiding (Functor, Applicative, pure, return, fmap, (<$>), (<*>), sequence)

-- | Apply a binary function in the environment.
--
-- >>> lift (+) (Id 7) (Id 8)
-- Id 15
--
-- >>> lift (+) [1, 2, 3] [4, 5]
-- [5,6,6,7,7,8]
--
-- >>> lift (+) (Just 7) (Just 8)
-- Just 15
--
-- >>> lift (+) (Just 7) Nothing
-- Nothing
--
-- >>> lift (+) Nothing (Just 8)
-- Nothing
sum::[Integer]->Integer
sum []=0
sum (x:xs)=x+ sum xs

sum l=sum1 0 l
where
    sum1 a []=a
    sum1 a (x:xs)=sum1 (a+x) xs

fib 0=1
fib 1=1
fib n=fib (n-1)+fib (n-2)

fib n=fibs n 0 1
where 
    fibs 0 a b=b
    fibs n a b=fibs (n-1) b (a+b)








lift :: Applicative f => (a -> b -> c) -> f a -> f b -> f c

lift f a b= f <$> a <*> b




-- | Turn a list of structured items into a structured list of item, bailing on
-- nils.
--
-- /Hint/: use @foldr@
--
-- >>> sequence [Id 7, Id 8, Id 9]
-- Id [7,8,9]
--
-- >>> sequence [[1, 2, 3], [1, 2]]
-- [[1,1],[1,2],[2,1],[2,2],[3,1],[3,2]]
--
-- >>> sequence [Just 7, Nothing]
-- Nothing
--
-- >>> sequence [Just 7, Just 8]
-- Just [7,8]
sequence :: Applicative f => [f a] -> f [a]
sequence [] =pure []
sequence (x:xs)=(:) <$> x <*> sequence xs

lift f a b= f <$> a <*> b
--sequence (x:xs)=lift (:) x (sequence xs)

sequence = foldr (lift (:)) (pure [])


-- | Replicate an effect a given number of times.
--
-- /Hint/: use @replicate@
--
-- >>> replicateA 4 (Id "hi")
-- Id ["hi","hi","hi","hi"]
--
-- >>> replicateA 4 (Just "hi")
-- Just ["hi","hi","hi","hi"]
--
-- >>> replicateA 4 Nothing
-- Nothing
--
-- >>> replicateA 3 ['a', 'b', 'c']
-- ["aaa","aab","aac","aba","abb","abc","aca","acb","acc","baa","bab","bac","bba","bbb","bbc","bca","bcb","bcc","caa","cab","cac","cba","cbb","cbc","cca","ccb","ccc"]
replicateA :: Applicative f => Int -> f a -> f [a]
replicateA 0 y =pure []
replicateA x y= (:) <$> y <*> (replicateA (x-1) y)


-- | Tricky: do your best
-- | Filter a list with a predicate that produces an effect.
--
-- >>> filtering (Id . even) [4, 5, 6]
-- Id [4,6]
--
-- Filter all elements under 7, unless there is one over 13.
-- >>> sieve a = if a > 13 then Nothing else Just (a <= 7)
--
-- >>> filtering sieve [4, 5, 6]
-- Just [4,5,6]
--
-- >>> filtering sieve [4, 5, 6, 7, 8, 9]
-- Just [4,5,6,7]
--
-- >>> filtering sieve [4, 5, 6, 13, 14]
-- Nothing
--
-- >>> filtering (const $ [True, True]) [1, 2, 3]
-- [[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]]
filtering :: Applicative f => (a -> f Bool) -> [a] -> f [a]
filtering=undefined



