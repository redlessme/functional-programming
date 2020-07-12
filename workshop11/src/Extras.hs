module Extras where

import Prelude
import Data.Char

import Instances
import Parser

-- | Write a parser that produces a character that satisfies all of the given
-- predicates.
--
-- /Tip:/ Use @sequence@ and @and@.
--
-- >>> conds = [isUpper, (/= 'X')]
-- >>> parse (satisfyAll conds) "ABC"
-- Result >BC< 'A'
--
-- >>> parse (satisfyAll conds) "ABc"
-- Result >Bc< 'A'
--
-- >>> isErrorResult (parse (satisfyAll conds) "XBc")
-- True
--
-- >>> isErrorResult (parse (satisfyAll conds) "")
-- True
--
-- >>> isErrorResult (parse (satisfyAll conds) "abc")
-- True
satisfyAll :: [Char -> Bool] -> Parser Char
satisfyAll = undefined

-- | Write a parser that produces a character that satisfies any of the given
-- predicates.
--
-- /Tip:/ Use @sequence@ and @or@.
--
-- >>> conds = [isLower, (/= 'X')]
-- >>> parse (satisfyAny conds) "abc"
-- Result >bc< 'a'
--
-- >>> parse (satisfyAny conds) "ABc"
-- Result >Bc< 'A'
--
-- >>> isErrorResult (parse (satisfyAny conds) "XBc")
-- True
--
-- >>> isErrorResult (parse (satisfyAny conds) "")
-- True
satisfyAny :: [Char -> Bool] -> Parser Char
satisfyAny = undefined

-- | Write a function that tries the given parser, otherwise succeeds by
-- producing the given value.
--
-- /Tip:/ Use @|||@.
--
-- >>> parse (option 'x' character) "abc"
-- Result >bc< 'a'
--
-- >>> parse (option 'x' character) ""
-- Result >< 'x'
option :: a -> Parser a -> Parser a
option = undefined

-- | Return a parser that puts its input into the given parser and:
--
--   * if that parser succeeds with a value, ignore that value but put the
--     remaining input into the second given parser; or
--
--   * if that parser fails with an error the returned parser fails with that
--     error.
--
-- /Tip:/ Use /bind/ @(>>=)@.
--
-- >>> parse (character >>> pure 'v') "abc"
-- Result >bc< 'v'
--
-- >>> isErrorResult (parse (character >>> pure 'v') "")
-- True
(>>>) :: Parser a -> Parser b -> Parser b
(>>>) = undefined

-- | Parses the given input and returns the result.
-- The remaining input is ignored.
(<.>) :: Parser a -> Input -> Maybe a
(<.>) = undefined
