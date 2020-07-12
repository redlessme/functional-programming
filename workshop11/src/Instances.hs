module Instances where

import qualified Numeric as N

data ParseError =
    UnexpectedEof
  | ExpectedEof Input
  | UnexpectedChar Char
  | UnexpectedString String
  deriving (Eq, Show)

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
  fmap f (P p) = P (\i -> f <$> p i)

instance Applicative Parser where
  -- creates a Parser that always succeeds with the given input
  pure x = P (`Result` x)

  (<*>) p q = p >>= (\f -> q >>= (pure . f))

instance Monad Parser where
  (>>=) (P p) f = P (
    \i -> case p i of
      Result rest x -> parse (f x) rest
      Error e -> Error e)

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

readInt :: String -> Maybe (Int, String)
readInt s = case reads s of
              [(x,rest)] -> Just (x,rest)
              _ -> Nothing
