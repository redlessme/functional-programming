import System.FilePath.Glob (glob)
import Test.DocTest (doctest)

main :: IO ()
main = do
    glob "src/week6/Pair.hs" >>= doctest
    glob "src/week6/List.hs" >>= doctest
    glob "src/week6/BinTree.hs" >>= doctest