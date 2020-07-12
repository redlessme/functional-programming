data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun
    deriving (Eq,Show)
-- week = [Thu, Mon, Sun, Wed, Tue, Fri, Sat]
instance Ord Day where
    compare Mon Tue=LT
    compare Tue Wed=LT
    compare Wed Thu=LT
