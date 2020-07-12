module Callcentre
where
import Prelude

-- | Given a (name,phonenumber) tuple, maybeName should return:
-- | Just the name if the phonenumber has precisely 10 digits.
-- | Otherwise Nothing.
--
-- >>> maybeName ("Tim","0178866524")
-- Just "Tim"
-- >>> maybeName ("Tim","01788524")
-- Nothing
maybeName :: (String, String) -> Maybe String
maybeName (a,b)
  | length (b) == 10 = Just $ a
  | otherwise = Nothing



-- | Generate scripts for a call centre - for each number that is valid (has 10 digits).
-- | use maybeName, greet, and <$> - only!
-- $setup
-- >>> phonebook = [ ("Bob",   "0178866524"), ("Fred",  "01624556442"), ("Alice", "0188998533") ]
-- >>> generateScripts phonebook
-- [Just "Hello Bob",Nothing,Just "Hello Alice"]
generateScripts :: [(String, String)] -> [Maybe String]
generateScripts pb = (greet<$>) <$> (maybeName <$> pb)
  where greet = ("Hello "++)

