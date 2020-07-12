module JSON where

import Prelude
import Data.Char
import Control.Monad
import Control.Applicative

import Instances
import Parser
import Specials
--import Extras

type Assoc = [(String, JsonValue)]

data JsonValue =
     JsonString String
   | JsonRational !Rational
   | JsonObject Assoc
   | JsonArray [JsonValue]
   | JsonTrue
   | JsonFalse
   | JsonNull
  deriving (Show, Eq)

-- | Write a function that applies the first parser, runs the third parser
-- keeping the result, then runs the second parser and produces the obtained
-- result.
--
-- /Tip:/ Use the monad instance.
--
-- >>> parse (between (is '[') (is ']') character) "[a]"
-- Result >< 'a'
--
-- >>> isErrorResult (parse (between (is '[') (is ']') character) "[abc]")
-- True
--
-- >>> isErrorResult (parse (between (is '[') (is ']') character) "[abc")
-- True
--
-- >>> isErrorResult (parse (between (is '[') (is ']') character) "abc]")
-- True
between :: Parser o -> Parser c -> Parser a -> Parser a
between = undefined

-- | Write a function that applies the given parser in between the two given
-- characters.
--
-- /Tip:/ Use @between@ and @charTok@.
--
-- >>> parse (betweenCharTok '[' ']' character) "[a]"
-- Result >< 'a'
--
-- >>> isErrorResult (parse (betweenCharTok '[' ']' character) "[abc]")
-- True
--
-- >>> isErrorResult (parse (betweenCharTok '[' ']' character) "[abc")
-- True
--
-- >>> isErrorResult (parse (betweenCharTok '[' ']' character) "abc]")
-- True
betweenCharTok :: Char -> Char -> Parser a -> Parser a
betweenCharTok = undefined

-- | Write a function that parses 4 hex digits and return the character value.
--
-- /Tip:/ Use @chr@, @readHex@, @isHexDigit@, @thisMany@, @satisfy@.
--
-- >>> parse hex "0010"
-- Result >< '\DLE'
--
-- >>> parse hex "0a1f"
-- Result >< '\2591'
--
-- >>> isErrorResult (parse hex "001")
-- True
--
-- >>> isErrorResult (parse hex "0axf")
-- True
hex :: Parser Char
hex = undefined

-- | Write a function that parses the character 'u' followed by 4 hex digits
-- and return the character value.
--
-- /Tip:/ Use @is@ and @hex@.
--
-- >>> parse hexu "u0010"
-- Result >< '\DLE'
--
-- >>> parse hexu "u0a1f"
-- Result >< '\2591'
--
-- >>> isErrorResult (parse hexu "0010")
-- True
--
-- >>> isErrorResult (parse hexu "u001")
-- True
--
-- >>> isErrorResult (parse hexu "u0axf")
-- True
hexu :: Parser Char
hexu = undefined

-- | Return a parser that produces the given special character.
--
-- /Tip:/ use @toSpecialCharacter@ and @fromSpecialCharacter@.
--
-- >>> parse specialChar "b"
-- Result >< '\b'
--
-- >>> parse specialChar "\""
-- Result >< '"'
--
-- >>> isErrorResult (parse specialChar "a")
-- True
specialChar :: Parser Char
specialChar = undefined

-- | Parse a special character or a hexadecimal in JSON, has to start with
-- '\\'. See http://json.org for the full list of control characters in JSON.
--
-- /Tip:/ Use @hexu@ and @specialChar@.
--
-- >>> parse jsonSpecial "\\u0af3"
-- Result >< '\2803'
--
-- >>> parse jsonSpecial "\\b"
-- Result >< '\b'
--
-- >>> isErrorResult (parse jsonSpecial "\\a")
-- True
jsonSpecial :: Parser Char
jsonSpecial = undefined

-- | Parse a JSON string. Handle double-quotes, special characters, hexadecimal
-- characters.
--
-- /Tip:/ Use @between@, @is@, @charTok@, @noneof@, @jsonSpecial@.
--
-- /Tip:/ The inner parser needs to "fail" to trigger the second delimiter.
--
-- >>> parse jsonString "\" abc\""
-- Result >< " abc"
--
-- >>> parse jsonString "\"abc\"def"
-- Result >def< "abc"
--
-- >>> parse jsonString "\"abc\"   def"
-- Result >def< "abc"
--
-- >>> parse jsonString "\"\\babc\"def"
-- Result >def< "\babc"
--
-- >>> parse jsonString "\"\\u00abc\"def"
-- Result >def< "\171c"
--
-- >>> parse jsonString "\"\\u00ffabc\"def"
-- Result >def< "\255abc"
--
-- >>> parse jsonString "\"\\u00faabc\"def"
-- Result >def< "\250abc"
--
-- >>> isErrorResult (parse jsonString "abc")
-- True
--
-- >>> isErrorResult (parse jsonString "\"\\abc\"def")
-- True
jsonString :: Parser String
jsonString = undefined

-- | Parse a JSON rational.
--
-- /Tip:/ Use @readFloats@, @tok@.
--
-- >>> parse jsonNumber "234"
-- Result >< 234 % 1
--
-- >>> parse jsonNumber "-234"
-- Result >< (-234) % 1
--
-- >>> parse jsonNumber "123.45"
-- Result >< 2469 % 20
--
-- >>> parse jsonNumber "-123"
-- Result >< (-123) % 1
--
-- >>> parse jsonNumber "-123.45"
-- Result >< (-2469) % 20
--
-- >>> isErrorResult (parse jsonNumber "-")
-- True
--
-- >>> isErrorResult (parse jsonNumber "abc")
-- True
jsonNumber :: Parser Rational
jsonNumber = undefined

-- | Parse a JSON true literal.
--
-- /Tip:/ Use @stringTok@.
--
-- >>> parse jsonTrue "true"
-- Result >< "true"
--
-- >>> isErrorResult (parse jsonTrue "TRUE")
-- True
jsonTrue :: Parser String
jsonTrue = undefined

-- | Parse a JSON false literal.
--
-- /Tip:/ Use @stringTok@.
--
-- >>> parse jsonFalse "false"
-- Result >< "false"
--
-- >>> isErrorResult (parse jsonFalse "FALSE")
-- True
jsonFalse :: Parser String
jsonFalse = undefined

-- | Parse a JSON null literal.
--
-- /Tip:/ Use @stringTok@.
--
-- >>> parse jsonNull "null"
-- Result >< "null"
--
-- >>> isErrorResult (parse jsonNull "NULL")
-- True
jsonNull :: Parser String
jsonNull = undefined

-- | Write a parser that parses between the two given characters, separated by
-- a comma character ','.
--
-- /Tip:/ Use @betweenCharTok@, @sepby@ and @commaTok@.
--
-- >>> parse (betweenSepbyComma '[' ']' lower) "[a]"
-- Result >< "a"
--
-- >>> parse (betweenSepbyComma '[' ']' lower) "[]"
-- Result >< ""
--
-- >>> parse (betweenSepbyComma '[' ']' lower) "[a,b,c]"
-- Result >< "abc"
--
-- >>> isErrorResult (parse (betweenSepbyComma '[' ']' lower) "[A]")
-- True
--
-- >>> isErrorResult (parse (betweenSepbyComma '[' ']' lower) "[abc]")
-- True
--
-- >>> isErrorResult (parse (betweenSepbyComma '[' ']' lower) "[a")
-- True
--
-- >>> isErrorResult (parse (betweenSepbyComma '[' ']' lower) "a]")
-- True
betweenSepbyComma :: Char -> Char -> Parser a -> Parser [a]
betweenSepbyComma = undefined

-- | Parse a JSON array.
--
-- /Tip:/ Use @betweenSepbyComma@ and @jsonValue@.
--
-- >>> parse jsonArray "[]"
-- Result >< []
--
-- >>> parse jsonArray "[true]"
-- Result >< [JsonTrue]
--
-- >>> parse jsonArray "[true, \"abc\"]"
-- Result >< [JsonTrue,JsonString "abc"]
--
-- >>> parse jsonArray "[true, \"abc\", []]"
-- Result >< [JsonTrue,JsonString "abc",JsonArray []]
--
-- >>> parse jsonArray "[true, \"abc\", [false]]"
-- Result >< [JsonTrue,JsonString "abc",JsonArray [JsonFalse]]
jsonArray :: Parser [JsonValue]
jsonArray = undefined

-- | Parse a JSON object.
--
-- /Tip:/ Use @jsonString@, @charTok@, @betweenSepbyComma@ and @jsonValue@.
--
-- /Tip:/ Remember the type of @Assoc = [(String, JsonValue)]@.
--
-- /Tip:/ Use anonymous apply @(<*)@ to omit tokens.
--
-- >>> parse jsonObject "{}"
-- Result >< []
--
-- >>> parse jsonObject "{ \"key1\" : true }"
-- Result >< [("key1",JsonTrue)]
--
-- >>> parse jsonObject "{ \"key1\" : true , \"key2\" : false }"
-- Result >< [("key1",JsonTrue),("key2",JsonFalse)]
--
-- >>> parse jsonObject "{ \"key1\" : true , \"key2\" : false } xyz"
-- Result >xyz< [("key1",JsonTrue),("key2",JsonFalse)]
jsonObject :: Parser Assoc
jsonObject = undefined

-- | Parse a JSON value.
--
-- /Tip:/ Use @spaces@, @jsonNull@, @jsonTrue@, @jsonFalse@, @jsonArray@,
-- @jsonString@, @jsonObject@ and @jsonNumber@.
--
-- /Tip:/ Use anonymous map @(<$)@ to "type-hint" your literals.
--
-- /Tip:/ Use fmap @(<$>)@ to "type-hint" your values.
--
-- >>> parse jsonValue "true"
-- Result >< JsonTrue
--
-- >>> parse jsonObject "{ \"key1\" : true , \"key2\" : [7, false] }"
-- Result >< [("key1",JsonTrue),("key2",JsonArray [JsonRational (7 % 1),JsonFalse])]
--
-- >>> parse jsonObject "{ \"key1\" : true , \"key2\" : [7, false] , \"key3\" : { \"key4\" : null } }"
-- Result >< [("key1",JsonTrue),("key2",JsonArray [JsonRational (7 % 1),JsonFalse]),("key3",JsonObject [("key4",JsonNull)])]
jsonValue :: Parser JsonValue
jsonValue = undefined

-- | Read a file into a JSON value.
--
-- /Tip:/ Use @readFile@ and @jsonValue@.
readJsonValue :: FilePath -> IO (ParseResult JsonValue)
readJsonValue = undefined
