{-# LANGUAGE InstanceSigs #-}

module Functor (Functor (..)) where

import Base
import Prelude hiding (Functor, fmap, (<$>))

-- | All instances of the `Functor` type-class must satisfy two laws. These laws
-- are not checked by the compiler. These laws are given as:
--
-- * The law of identity
--   fmap id  ==  id
--
-- * The law of composition
--   fmap (f . g)  ==  fmap f . fmap g
class Functor f where
  -- Pronounced "f map"
  (<$>) :: (a -> b) -> f a -> f b

infixl 4 <$>

-- | Map a function on the Id functor.
--
-- >>> (+1) <$> Id 2
-- Id 3
instance Functor Id where
  (<$>) :: (a -> b) -> Id a -> Id b
  f <$> (Id a) = Id (f a)

-- | Map a function on the Pair functor.
--
-- >>> (+1) <$> (Pair 5 7)
-- Pair 6 8
--
-- >>> (*2) <$> (Pair 5 7)
-- Pair 10 14
instance Functor Pair where
  (<$>) :: (a -> b) -> Pair a -> Pair b
  f <$> (Pair x y) = Pair (f x) (f y)

-- | Map a function on the List functor.
--
-- >>> (+1) <$> []
-- []
--
-- >>> (+1) <$> [1, 2, 3]
-- [2,3,4]
instance Functor [] where
  (<$>) :: (a -> b) -> [a] -> [b]
  _ <$> [] = []
  f <$> (x:xs) = f x : (f <$> xs)

-- | Map a function on the Maybe functor.
--
-- >>> (+1) <$> Nothing
-- Nothing
--
-- >>> (+1) <$> Just 2
-- Just 3
instance Functor Maybe where
  (<$>) :: (a -> b) -> Maybe a -> Maybe b
  _ <$> Nothing = Nothing
  f <$> (Just x) = Just (f x)

-- | Map a function on each element of a RoseTree, where:
-- | data RoseTree a = Nil | Node a [RoseTree a]
-- | thus: a RoseTree Node has a value and a list of child RoseTrees.
-- | Hint: This follows the same pattern as the examples above.
-- | However, for the children, you will need to map the RoseTree
-- | fmap instance over the list.
--
-- >>> (+1) <$> Nil
-- Nil
--
-- >>> (+1) <$> Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]]
-- Node 8 [Node 2 [],Node 3 [],Node 4 [Node 5 []]]
instance Functor RoseTree where
  (<$>) :: (a -> b) -> RoseTree a -> RoseTree b
  _ <$> Nil = Nil
  f <$> (Node x l) = Node (f x) ((f <$>) <$> l)
