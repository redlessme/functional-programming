-- foldright f z []     = z
-- foldright f z (x:xs) = x f (foldright f z xs)

--foldr f a []     = a
--foldr f a (x:xs) = f x (foldr f a xs)