{-# LANGUAGE NoImplicitPrelude #-}
-- | Given a file containing a list of files, open the listed files and print
-- their content, one after the other, in the output.
module FileIO where

import Base
import Functor
import Applicative hiding ((<$>), (<*>))
import Monad
import Functions
import Support

-- Support functions

-- Available library:
--  * @readFile@ Read the content of a file and wrap it in @IO@.
--  * @lines@ Split a string by newline character
--  * @putStrLn@ Write a line on the output

-- | Anonymous map. Map a value on a functor.
(<$) :: (Functor f) => a -> f b -> f a
(<$) a b = const a <$> b

-- | Ignore the content of an @IO@.
void :: IO a -> IO ()
void = (<$) ()

-- Code

-- | Print a file's content in the following format:
-- > ================ <filename>
-- > <content>
-- > <of>
-- > <the>
-- > <file>
printFile :: (FilePath, String) -> IO ()
printFile (f,s)=(((++) "================") <$> (readFile f))>>= putStrLn
    
-- | Print the contents of a list of files.
printFiles :: [(FilePath, String)] -> IO ()
printFiles lis= convert $ map printFile lis
    where convert _=putStrLn ""
    
-- | Open the file given as parameter and return a tuple with the name of the
-- file and its content.
getFile :: FilePath -> IO (FilePath, String)
getFile f=((,) f) <$> (readFile f)

-- | Open a list of files.
getFiles :: [FilePath] -> IO [(FilePath, String)]
getFiles lis=Applicative.sequence $ map getFile lis

-- | Process a list of files.

-- | Given a path, open and print the contents of the files listed.
--
-- /Tip:/ Use @getFiles@ and @printFiles@.
run :: FilePath -> IO ()
run p=do
    str<-readFile p
    let lis=lines str
    getFiles lis>>=printFiles