data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun
    -- deriving (Eq,Show)
instance Show Day where
    show Sat="Sleep in"
    show Sun="Oh no it's nearly Monday"
    show _ ="Sign"