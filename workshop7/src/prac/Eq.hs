data Day = Mon | Tue | Wed | Thu | Fri | Sat | Sun
    -- deriving (Eq,Show)
instance Eq Day where
    Sat==Sat=True
    Sat==_=False
    Sun==Sun=True
    Sun==_=False
    _==Sat=False
    _==Sun=False
    _==_=True
    