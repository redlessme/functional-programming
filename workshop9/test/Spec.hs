import Test.DocTest (doctest)
import System.FilePath.Glob (glob)
import Prelude(IO, return, ($))

main :: IO ()
main = do
  path <- glob "src/*.hs"
  doctest $ "-isrc": path
  return ()
