-- data Student = Student Int String Int

best::[Student]->Student->Student
best[]b=b
best (a@(Student _ _ am):rest) b@ (Student _ _ bm) =
    if am>bm
        then best rest a
        else best rest b

-- id (Student n _ _ )=n
-- name (Student _ n _)=n
-- mark( Student _ _ n)=n

data Student = Student {id::Integer, name::String, mark::Int}
