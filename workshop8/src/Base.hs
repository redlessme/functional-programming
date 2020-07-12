{-# LANGUAGE NoImplicitPrelude #-}
module Base where

import Prelude(Show, IO, print, (+), (*))

data Id a = Id a
  deriving(Show)
data Pair a = Pair a a
  deriving(Show)
data RoseTree a = Nil | Node a [RoseTree a]
  deriving(Show)



