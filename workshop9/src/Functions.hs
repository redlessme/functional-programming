{-# LANGUAGE NoImplicitPrelude #-}
-- | The goal of this module is to rewrite "standard" Haskell functions using
-- `fold` only.
module Functions where

import Base

-- $setup
-- import Test.QuickCheck

-- | Rewrite @sum@ using @foldr@.
--
-- >>> sum [1, 2, 3]
-- 6
--
-- >>> sum [1..10]
-- 55
--
-- prop> \x -> foldl (-) (sum x) x == 0
sum :: Num a => [a] -> a
sum =foldr (+) 0

-- | Rewrite @product@ using @foldr@.
--
-- >>> product [1, 2, 3]
-- 6
--
-- >>> product [1..10]
-- 3628800
product :: Num a => [a] -> a
--product = foldr (\i a-> i*a) 1
product=foldr (*) 1
-- | Rewrite @length@ using @foldr@.
--
-- >>> length [1, 2, 3]
-- 3
--
-- >>> length []
-- 0
--
-- prop> sum (map (const 1) x) == length x
-- leghthA::[a]->Int
-- lengthA []=0
-- lengthA (x:xs)=1+lengthA xs



length :: [a] -> Int
--length =foldr (\i a->1+a) 0 
--length=foldr (\i ->(1+)) 0
length=foldr (const (1+)) 0
-- | Rewrite @map@ using @foldr@.
--
-- >>> map (+ 1) [1, 2, 3]
-- [2,3,4]
--
-- >>> map (* 2) [1, 2, 3]
-- [2,4,6]
--
-- prop> map id x == x
map :: (a->b) -> [a] -> [b]
-- map f []=[]s
-- map f (x:xs)=(f x):(map f xs)
--map f =foldr (\x xs->(f x):xs) []  --point free
--map f =foldr (\x-> (:) (f x)) []
map f=foldr ((:).f) [] --composition

-- | Rewrite @filter@ using @foldr@.
--
-- >>> filter (< 3) [1, 2, 3]
-- [1,2]
--
-- >>> filter even [1, 2, 3, 4, 5]
-- [2,4]
--
-- prop> filter (const True) l == l
--
-- prop> filter (const False) l == []
filter :: (a->Bool) -> [a] -> [a]
filter f=foldr (\x xs->if f x then x:xs else xs) []

-- | Rewrite /append/ @(++)@ using @foldr@.
--
-- /Optional/: write this in point-free notation
--
-- >>> [1] ++ [2] ++ [3]
-- [1,2,3]
--
-- >>> "abc" ++ "d"
-- "abcd"
--
-- prop> (x ++ []) == x
--
-- Associativity of append.
-- prop> (x ++ y) ++ z == x ++ (y ++ z)

(++) :: [a] -> [a] -> [a]
--(++) xs ys=foldr (\i a->i:a   ) ys xs
(++) xs ys=foldr (:) ys xs



-- | Rewrite @all@ using @foldr@.
--
-- >>> all [True, True, True]
-- True
--
-- >>> all [False, True, True]
-- False
all :: [Bool] -> Bool

--all =foldr (\x y->if x==True && y==True then True else False) True --y is True, the accumulator
all=foldr (&&) True

-- | Rewrite @any@ using @foldr@.
--
-- >>> any [False, False, False]
-- False
--
-- >>> any [False, True, False]
-- True
any :: [Bool] -> Bool
any =foldr (||) False

-- | Flatten a (once) nested list.
--
-- >>> flatten [[1], [2], [3]]
-- [1,2,3]
--
-- >>> flatten [[1, 2], [3], []]
-- [1,2,3]
--
-- prop> sum (map length x) == length (flatten x)
flatten :: [[a]] -> [a]
flatten = foldr (++) [] 
