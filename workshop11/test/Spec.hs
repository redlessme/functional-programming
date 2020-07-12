import Test.DocTest (doctest)
import Prelude (IO, return, ($))

main :: IO ()
main = do
  doctest ["-isrc", "src/Parser.hs"]
  -- The following are optional, but recommended if you plan to use a parser in your assignment
  -- doctest ["-isrc", "src/Extras.hs"]
  -- doctest ["-isrc", "src/JSON.hs"]
  return ()
