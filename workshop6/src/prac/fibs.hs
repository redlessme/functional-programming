--fibnacii
-- fibs 0=1
-- fibs 1=1
-- fibs n=fibs(n-1)+fibs(n-2)

-- fibonacci n=fibs n 1 1
--     where
--         fibs 0 a b = a
--         fibs n a b=fibs(n-1) b (a+b)

fibonacci n = 
    let 
        fibs 0 a b = a
        fibs n a b = fibs(n-1) b (a+b)
    in
        fibs n 1 1
main :: IO()
main=print $ map fibs[1..10]
    
        
