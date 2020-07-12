module Maybes where

-- $setup
-- >>> ljust = [Just 1, Just 7, Just 3]
-- >>> lnaught = [Just 3, Nothing, Just 8]

-- | Simple boolean check for @Maybe@ values.
--
-- >>> isJust (Just 1)
-- True
--
-- >>> isJust Nothing
-- False
isJust :: Maybe a -> Bool
isJust(Just a)=True
isJust(Nothing)=False






-- | Inverse of @isJust@.
--
-- >>> isNothing (Just 1)
-- False
--
-- >>> isNothing Nothing
-- True
isNothing :: Maybe a -> Bool
isNothing(Just a)=False
isNothing Nothing=True

-- | Extract the value of a @Just@ but return a fallback in case of @Nothing@.
--
-- >>> fromMaybe (Just 3) 7
-- 3
--
-- >>> fromMaybe Nothing 7
-- 7
fromMaybe :: Maybe a -> a -> a
fromMaybe Nothing a=a
fromMaybe (Just a) b=a




fib n=fib1 n 0 1
where 
    fib1 0 _ b=b
    fib1 n a b= fib1 (n-1) b (a+b)

sum l=sum1 0 l
where 
    sum1 a []=a
    sum1 a (x:xs)=sum1 (a+x) xs

sort []=[]
sort (pivot:rest)=lessor++[pivot]++greater
where 
    lessor=sort$ filter (<pivot) rest
    greater=sort $ filter(>=pivot) rest








-- | Gather @Just@ values in a list, filter the @Nothing@.
--
-- >>> catMaybe ljust
-- [1,7,3]
--
-- >>> catMaybe lnaught
-- [3,8]
catMaybe ::[Maybe a] -> [a]
-- catMaybe =undefined
catMaybe []=[]
catMaybe(Nothing:xs)=catMaybe xs
catMaybe (Just x:xs)=x:catMaybe xs





