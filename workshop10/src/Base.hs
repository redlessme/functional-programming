{-# LANGUAGE NoImplicitPrelude #-}

module Base(
  Maybe(..), RoseTree(..), Monoid(..), Id(..), List(..), Pair(..), Num(..),
  Bool(..), Sum(..), Product(..), Int, Integer(..), String, IO(..), FilePath,
  flip, foldr, even, undefined, const, id, otherwise, reverse, foldl, succ,
  last, max, lines, sequence, error, readFile, putStrLn, div,
  (.), ($), (&&), (||), (==), (<), (>), (<=), (>=), (<>), (>>)
) where


import Prelude(
  Num(..), Int, Show, Integer(..), String, IO(..),
  flip, foldr, even, undefined, const, id, otherwise, reverse, foldl, succ,
  last, max, lines, sequence, error, div,
  (.), ($), (==), (<), (>), (<=), (>=), (>>))

import qualified Prelude as P((++))

import Data.Monoid
import Data.Maybe
import Data.Bool
import Data.Char
import System.IO

data RoseTree a = Node a [RoseTree a] | Nil
  deriving(Show)

data Id a = Id a
  deriving(Show)

data Pair a = Pair a a
  deriving(Show)

-- | List monoid under concatenation.
newtype List a = List { elems :: [a] }

instance Monoid (List a) where
  mempty = List []                            -- Identity
  mappend (List l) (List m) = List (l P.++ m) -- Concatenation
