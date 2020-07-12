-- module Pointfree
-- where
-- import Prelude

-- -- | Sort the phonebook by name then number
-- --
-- -- >>> phonebook = [("Sally",123),("Bob",435),("Yan",542),("Bob",435),("Fred",678),("Yan",124),("Alice",567)]
-- --
-- -- >>> sort []
-- -- []
-- -- >>> sort phonebook
-- -- [("Alice",567),("Bob",435),("Bob",435),("Fred",678),("Sally",123),("Yan",124),("Yan",542)]
-- sort [] = []
-- sort (pivot:rest) = below pivot rest ++ [pivot] ++ above pivot rest
--  where
--    below p l = part (<p) l
--    above p l = part (>=p) l
--    part test l = sort (filter test l)

--ex1
func::Num a=>a->a->a->a
func a b c=(a*b)+c
func a b c=((*)a b)+c
func a b c=(+) ((*)a b) c
func a b=(+) ((*) a b)
func a b=( (+).(*)) a b
func = (+).(*)


