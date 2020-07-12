module Instances where

import qualified Numeric as N

data ParseError =
    UnexpectedEof
  | ExpectedEof Input
  | UnexpectedChar Char
  | UnexpectedString String
  deriving Eq

data ParseResult a =
    Error ParseError
  | Result Input a
  deriving Eq

type Input = String
newtype Parser a = P{parse :: Input -> ParseResult a}

-- Result Instances

instance Show a => Show (ParseResult a) where
  show (Result i a)                 = "Result >" ++ i ++ "< " ++ show a
  show (Error UnexpectedEof)        = "Unexpected end of stream"
  show (Error (UnexpectedChar c))   = "Unexpected character: " ++ show [c]
  show (Error (UnexpectedString s)) = "Unexpected string: " ++ show s
  show (Error (ExpectedEof i))      =
    "Expected end of stream, but got >" ++ show i ++ "<"

instance Functor ParseResult where
  fmap f (Result i a) = Result i (f a)
  fmap _ (Error e)    = Error e

-- Parser Instances

instance Functor Parser where
  fmap = undefined

instance Applicative Parser where
  pure = undefined

  (<*>) = undefined

instance Monad Parser where
  (>>=) = undefined

-- Support Functions

isErrorResult :: ParseResult a -> Bool
isErrorResult (Error _) = True
isErrorResult _ = False

readFloats :: (RealFrac a) => String -> Maybe (a, String)
readFloats s =
  case N.readSigned N.readFloat s of
    ((a, s):_) -> Just (a, s)
    _ -> Nothing

readHex :: (Num a, Eq a) => String -> Maybe (a, String)
readHex s = case N.readHex s of
  ((a, s): _) -> Just (a, s)
  _ -> Nothing
