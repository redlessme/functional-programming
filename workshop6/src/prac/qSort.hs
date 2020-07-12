
-- sort [] = []
-- sort(pivot:rest) = lessor ++ [pivot] ++ greater
--     where
--         lessor= sort $ filter (<pivot) rest
--         greater=sort $ filter (>=pivot) rest

-- sort:: Ord t=> [t]->[t]
-- sort [] = []
-- sort(pivot:rest) = below pivot rest ++ [pivot] ++ above pivot rest
--     where
--         bewlow p = partion(<p)
--         above p = partion(>=p)
--     where
--         partion comparison = sort . filter comparison

sort:: Ord t=> [t]->[t]
-- sort [] = []
-- sort(pivot:rest) = below pivot rest ++ [pivot] ++ above pivot rest
--     where
--         below = partion.(>)
--         above  = partion.(>=)
--         partion comparison = sort . filter comparison

-- f(gx)=(f.g)x
-- sort []=[]
-- sort (pivot:rest)=lesser++[pivot]++greater
--     where
--         lesser= sort $ filter (<pivot) rest
--         greater=sort $ filter (>=pivot) rest

sort [] = []

sort (pivot:rest) = below pivot rest ++ [pivot] ++ above pivot rest
where
below  = part . (>) 
above  = part . (>=) 
part =(sort .) . filter
        
