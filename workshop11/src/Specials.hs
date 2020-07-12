module Specials where

import Data.Char

-- A special character is one of the following:
-- * \b  Backspace (ascii code 08)
-- * \f  Form feed (ascii code 0C)
-- * \n  New line
-- * \r  Carriage return
-- * \t  Tab
-- * \v  Vertical tab
-- * \'  Apostrophe or single quote (only valid in single quoted json strings)
-- * \"  Double quote (only valid in double quoted json strings)
-- * \\  Backslash character
data SpecialCharacter =
  BackSpace
  | FormFeed
  | NewLine
  | CarriageReturn
  | Tab
  | VerticalTab
  | SingleQuote
  | DoubleQuote
  | Backslash
  deriving (Eq, Ord, Show)

-- NOTE: This is not inverse to @toSpecialCharacter@.
fromSpecialCharacter :: SpecialCharacter -> Char
fromSpecialCharacter BackSpace      = chr 0x08
fromSpecialCharacter FormFeed       = chr 0x0C
fromSpecialCharacter NewLine        = '\n'
fromSpecialCharacter CarriageReturn = '\r'
fromSpecialCharacter Tab            = '\t'
fromSpecialCharacter VerticalTab    = '\v'
fromSpecialCharacter SingleQuote    = '\''
fromSpecialCharacter DoubleQuote    = '"'
fromSpecialCharacter Backslash      = '\\'

-- NOTE: This is not inverse to @fromSpecialCharacter@.
toSpecialCharacter :: Char -> Maybe SpecialCharacter
toSpecialCharacter c =
  let table = [('b', BackSpace),
               ('f', FormFeed),
               ('n', NewLine),
               ('r', CarriageReturn),
               ('t', Tab),
               ('v', VerticalTab),
               ('\'', SingleQuote),
               ('"' , DoubleQuote),
               ('\\', Backslash)]
  in snd <$> find ((==) c . fst) table
  where
    find _ [] = Nothing
    find p (x: xs)
      | p x = Just x
      | otherwise = find p xs
