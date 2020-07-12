{-# LANGUAGE InstanceSigs #-}

module Applicative where

import Base
import Functor
import Prelude hiding (Functor, Applicative, pure, return, fmap, (<$>), (<*>))

-- | All instances of the `Applicative` type-class must satisfy three laws.
-- These laws are not checked by the compiler. These laws are given as:
--
-- * The law of left identity
--   pure id <*> v = v
--
-- * The law of associative composition
--   pure (.) <*> u <*> v <*> w = u <*> (v <*> w)
--
-- * The law of homomorphism
--   pure f <*> pure x = pure (f x)
--
-- * The law of interchange
--   u <*> pure y = pure ($ y) <*> u

foldMap::Monoid m=>(a->m)->t a->m
instance F.Foldable Tree where
  foldMap f Empty=mempty
  foldMap f (leaf x)=f x
  foldMap f (Node x l r)=flodMap f l <> f x <> flodMap f r

instance Traversable Tree where
traverse :: Applicative f => (a -> f b) -> Tree a -> f (Tree b)
traverse _ Empty = pure Empty
traverse f (Leaf a) = Leaf <$> f a
traverse f (Node l x r)=Node <$>traverse f l<*>f x<*> traverse f r

fmap _ Empty=Empty
fmap f (Leaf x)=Leaf $ f x
fmap f (Node l x r)=Node (fmap f l) (f x) (fmap f r)




class Functor f => Applicative f where
  pure :: a -> f a
  -- Pronounced "apply"
  (<*>) :: f (a -> b) -> f a -> f b

infixl 4 <*>

-- | The @Applicative@ class derives from @Functor@, rewrite `fmap` using only
-- `pure` and `<*>`.
-- | Be cautious when using this `<$>` when defining your own `<*>`s - as this
-- calls `<*>`, you may get an infinite loop!
--
-- >>> (+1) <$> (Id 2)
-- Id 3
--
-- >>> (+1) <$> Nothing
-- Nothing
--
-- >>> (+1) <$> [1, 2, 3]
-- [2,3,4]

(<$>) :: Applicative f => (a -> b) -> f a -> f b
(<$>) f a=(<*>) (pure f) a


-- | Insert into Id.
--
-- >>> Id (+10) <*> Id 8
-- Id 18
instance Applicative Id where
  pure :: a -> Id a
  pure = Id
  (<*>) :: Id (a -> b) -> Id a -> Id b
  (<*>) (Id f) (Id a)=Id (f a) 

-- | Apply a list of functions over a list of elements, producing the
-- concatenation of the successive results.
--
-- >>> [(+1), (*2)] <*> [1, 2, 3]
-- [2,3,4,2,4,6]
instance Applicative [] where
  pure :: a -> [a]
  pure a=[a] 
  (<*>) :: [(a -> b)] -> [a] -> [b]
  fs <*> xs = [f x | f <- fs, x <- xs]

  


-- | Apply to a Maybe, must return `Nothing` if either the function or the
-- element is a `Nothing`.
--
-- >>> Just (+8) <*> Just 7
-- Just 15
--
-- >>> Nothing <*> Just 7
-- Nothing
--
-- >>> Just (+8) <*> Nothing
-- Nothing
instance Applicative Maybe where
  pure :: a -> Maybe a
  pure = Just 
  (<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b
  (<*>) Nothing _ = Nothing
  (<*>) _ Nothing=Nothing
  (<*>) (Just f) (Just a)= Just (f a)

-- | Tricky, but do your best: 
-- | Apply to a RoseTree, i.e. return a tree composed of trees created by the
-- | successive application of functions to initial nodes.
-- |
-- | Note: Avoid using <$> in this definition as we defined it above in terms of <*>.
-- |       You may get an infinite loop if you use it here...
-- |
-- | Hint: study the tests below closely...
-- | You will see that for: lhs <*> rhs,
-- | we map the function at the root of lhs over the root of rhs,
-- | then append the application of the remaining functions in lhs,
-- | to the end of the children of rhs
--
-- >>> (Node (+1) [Node (*2) []]) <*> Nil
-- Nil
--
-- >>> Nil <*> (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- Nil
--
-- >>> (Node (+1) []) <*> (Node 7 [Node 1 [], Node 2 [], Node 3 [Node 4 []]])
-- Node 8 [Node 2 [],Node 3 [],Node 4 [Node 5 []]]
--
-- >>> (Node (+1) [Node (*2) []]) <*> (Node 5 [Node 2 [], Node 8 [Node 1 []]])
-- Node 6 [Node 3 [],Node 9 [Node 2 []],Node 10 [Node 4 [],Node 16 [Node 2 []]]]
instance Applicative RoseTree where
  pure :: a -> RoseTree a
  pure =undefined
  (<*>) :: RoseTree (a -> b) -> RoseTree a -> RoseTree b
  (<*>)=undefined



   



