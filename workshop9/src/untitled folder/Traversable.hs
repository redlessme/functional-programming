{-# LANGUAGE InstanceSigs, NoImplicitPrelude #-}

module Traversable where

import Base
import Functor
import Functions
import Applicative

-- $setup
-- >>> sieve = (\x -> if even x then Just x else Nothing)

-- | A @Foldable@ is a structure which can be reduced to a single value given a
-- function.
--
-- /Hint/: Use the following "folding" function.
-- mconcat :: (Monoid m) => [m] -> m
--
-- /Hint/: Use the following "Nil."
-- mempty :: Monoid a => a
class Foldable f where
  foldMap :: (Monoid m) => (a -> m) -> f a -> m

-- | A @Traversable@ is a structure which can be /traversed/ while applying an
-- effect. Basically, it is a @Foldable@ with a @Functor@ instance.
--
-- /Hint/: You have to traverse __and__ apply an effect.
class (Functor t, Foldable t) => Traversable t where
  traverse :: (Applicative f) => (a -> f b) -> t a -> f (t b)

-- | Given a list with non-monoidal elements, and a function to put them into
-- a monoid, fold the list into the monoid.
--
-- We have to use a "monoid under addition."
-- >>> getSum $ foldMap Sum [1..10]
-- 55
--
-- >>> getProduct $ foldMap Product [1..10]
-- 3628800
--
-- List is also a monoid under concatenation (append).
-- >>> elems $ foldMap List [[1..10], [11..20]]
-- [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
instance Foldable [] where
  foldMap f [] =mempty
  foldMap f (x:xs)= f x `mappend` foldMap f xs

-- | Traverse a list while producing an effect.
-- Hint: use the sequence function you implemented in Workshop 8
--
-- >>> traverse sieve [2, 4, 6]
-- Just [2,4,6]
--
-- >>> traverse sieve [2, 4, 7]
-- Nothing

instance Traversable [] where
  traverse f [a] = sequence ( f <$> [a])
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


-- Now unto rose trees.

-- | Fold a RoseTree into a value.
-- Hint: use the Monoid's mempty, mappend and mconcat
--
-- >>> getSum $ foldMap Sum (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- 17
--
-- >>> getProduct $ foldMap Product (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- 168
instance Foldable RoseTree where
  foldMap :: (Monoid m) => (a -> m) -> RoseTree a -> m
  -- foldMap _ Nil=mempty
  -- foldMap f (Node x ts)=f x <> foldMap f ts

-- | Traverse a RoseTree while producing an effect.
--
-- >>> traverse sieve (Node 4 [Node 6 []])
-- Just (Node 4 [Node 6 []])
--
-- >>> traverse sieve (Node 4 [Node 6 [], Node 7 []])
-- Nothing
--
-- 
-- Hint: follow the types, use type holes to try to figure out what goes where.
-- Type holes allows GHCi to tell you the expected type at a location.
-- For example, if you're defining an addThreeIntegers function:
--
-- addThreeIntegers :: Integer -> Integer -> Integer -> Integer
-- addThreeIntegers x y z = (+) (??? x y) z
--
-- and you're not sure what you should put at "???", put a hole "_" there:
--
-- addThreeIntegers x y z = (+) (_ x y) z
--
-- When you run GHCi, it will tell you the type of the hole:
--
-- error:
--   Found hole: _ :: Integer -> Integer -> Integer
--
-- Hint (spoiler!): pattern match on Node to pull out the value and the list of child rosetrees
--                  then, you need to lift (as discussed in week 8) the Node constructor over
--                  (the traversing function applied to the value) and (the result of traversing a function over the list of child rosetrees).
-- Hint2(more spoiler!): the function you traverse over the child rosetrees, will itself be traversing a function over a rosetree  
-- Note: if even after reading all the hints and spoilers you are still completely mystified
-- then write down questions for your tutor and your best approximation in English of 
-- what you think needs to happen in English along with questions for your tutor.
instance Traversable RoseTree where
  traverse :: Applicative f => (a -> f b) -> RoseTree a -> f (RoseTree b)
  traverse = undefined
