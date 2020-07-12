import Base
import Support
import FileIO
import Monad

import qualified System.Environment as E

-- | Read the arguments passed to `main`.
getArgs :: IO [String]
getArgs = E.getArgs

-- | Prompt user for a file containing a list of files and print their content.
--
-- /Tip:/ use @getArgs@ and @run@
--
-- You can run this function in GHCi by calling:
-- > :main "input.txt"
main :: IO ()
main=join (run <*> getArgs)






