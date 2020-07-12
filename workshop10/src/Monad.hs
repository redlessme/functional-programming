{-# LANGUAGE NoImplicitPrelude #-}
module Monad where

import Base
import Functor
import Functions
import Applicative hiding((<*>), (<$>))

-- | All instances of the @Monad@ type-class must satisfy one law. This law
-- is not checked by the compiler. This law is given as:
--
-- * The law of associativity
--   g =<< (f =<< x) = ((g =<<) . f) =<< x
class Applicative f => Monad f where
  -- Pronounced: "bind."
  (=<<) :: (a -> f b) -> f a -> f b
  

infixr 1 =<<

-- | Rewrite /apply/ @(<*>)@ using /bind/ @(=<<)@ and /fmap/ @(<$>)@.
(<*>) = undefined

infixl 4 <*>

-- | Bind a function on a list.
--
-- >>> (\n -> [n, n]) =<< [1, 2, 3]
-- [1,1,2,2,3,3]
instance Monad [] where

  (=<<) f xs= flatten (map f xs)  -- map f to each value in the list [[1,1],[2,2],[3,3]] then flatten


-- | Bind a function on a @Maybe@.
--
-- >>> justDouble n = Just (n + n)
-- >>> justDouble =<< Just 7
-- Just 14
--
-- >>> justDouble =<< Nothing
-- Nothing
instance Monad Maybe where
  (=<<) f Nothing=Nothing
  (=<<) f  (Just x)= f x

-- | Flatten a combined structure to a single structure.
--
-- >>> join [[1, 2, 3], [1, 2]]
-- [1,2,3,1,2]
--
-- >>> join (Just Nothing)
-- Nothing
--
-- >>> join (Just (Just 7))
-- Just 7
join :: Monad m => m (m a) -> m a
join = (=<<) (\ma->ma)  



-- | Implement a flipped version of @(=<<)@, however, use only @join@ and
-- @(<$>)@.
--
-- Divide an integer by two if it is even.
-- >>> :{
-- half x | even x    = Just (x `div` 2)
--        | otherwise = Nothing
-- :}
--
-- >>> Just 20 >>= half
-- Just 10
--
-- >>> Just 20 >>= half >>= half >>= half
-- Nothing
-- (>>=) ::  f a-> (a -> f b) -> f b
(>>=) m f = join ( (<$>) f  m) -- f<$>m = Just(Just x)

-- | Implement composition within the @Monad@ environment. Called: "Kleisli
-- composition."
--
-- >>> (\n -> [n, n]) <=< (\n -> [n + 1, n + 2]) $ 1
-- [2,2,3,3]
(<=<) f g(a) = f=<<g(a) 

infixr 1 <=<

-- | Fold a list using a monadic function.
--
-- /Tip:/ Fold the monad from left to right on the list of arguments.
--
-- Sum the elements in a list, but fail if any is greater than 10.
-- >>> :{
-- small acc x
--   | x < 10 = Just (acc + x)
--   | otherwise = Nothing
-- :}
--
-- >>> foldM small 0 [1..9]
-- Just 45
--
-- >>> foldM small 0 [1..100]
-- Nothing
foldM::(Monad m)=>(a->b->m a)->a->[b]->m a
-- foldM f a []=a
-- foldM f a (x:xs)  =  (f a x) >>= \n -> foldM f n xs

foldM=undefined



