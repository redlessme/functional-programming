import Test.DocTest (doctest)
import System.FilePath.Glob (glob)

main :: IO ()
main = do
  path <- glob "src/*.hs"
  doctest path
  return ()
