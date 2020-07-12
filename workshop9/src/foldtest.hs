foldright::(a->b->b)->b->[a]->b

foldright f z (x:xs)=f x (foldright f z xs)
foldright f z []= z

foldleft::(b->a->b)->b->[a]->b
foldleft f z (x:xs)=foldleft f (f z x) xs
foldleft f z []=z
