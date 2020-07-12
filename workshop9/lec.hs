--readFile :: FilePath -> IO String


-- read :: Read a => String -> a

-- lines :: String -> [String]
sumFile :: FilePath -> IO Int
sumFile s=do
    f<-readFile s
    let str=lines f
    let num=map read str
    let no=sum num
    return no
