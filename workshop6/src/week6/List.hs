module List where

data List = List {size :: Int, elems :: [Int], low :: Int, high :: Int}
  deriving(Show)

-- $setup
-- >>> import Data.List(sort)
-- >>> list = (List 7 [1, 7, 9, 2, 6, 11, 3] 1 11)

-- | Create a `List` instance from a list of elements.
--
-- >>> fromList [1, 7, 9, 2, 6, 11, 3]
-- List {size = 7, elems = [1,7,9,2,6,11,3], low = 1, high = 11}
fromList :: [Int] -> List
fromList alist=List (length alist) alist (minimum alist) (maximum alist)

-- | Sort the list of elements in a list
--
-- >>> sortList list
-- List {size = 7, elems = [1,2,3,6,7,9,11], low = 1, high = 11}
--
-- prop> elems (sortList (List a l b c)) == sort l
sortList :: List -> List

sortList (List size elems low high) = 
  let
   sort [] = []
   sort (pivot:rest) = let
      below = partition (<pivot)
      above = partition (>=pivot)
    in
      below rest ++ [pivot] ++ above rest
    where
      partition comparison = sort . filter comparison
 in List size (sort elems) low high

-- | Add an element to a list.
--
-- >>> sortList $ addElem 4 list
-- List {size = 8, elems = [1,2,3,4,6,7,9,11], low = 1, high = 11}
--
-- >>> sortList $ addElem 13 list
-- List {size = 8, elems = [1,2,3,6,7,9,11,13], low = 1, high = 13}
--
-- >>> sortList $ addElem 0 list
-- List {size = 8, elems = [0,1,2,3,6,7,9,11], low = 0, high = 11}
addElem :: Int -> List -> List
addElem newElem (List size elems low high)
=List (size+1)(newElem:elems)(if newElem<low then newElem else low)(if newElem>high then newElem else high)
-- | Returns the longest of two lists.
--
-- >>> longest list (fromList [1, 2, 3])
-- List {size = 7, elems = [1,7,9,2,6,11,3], low = 1, high = 11}
--
-- >>> longest list (fromList [1..10])
-- List {size = 10, elems = [1,2,3,4,5,6,7,8,9,10], low = 1, high = 10}
longest :: List -> List -> List
longest(List size1 elems1 low1 high1) (List size2 elems2 low2 high2)
        =if size1>size2 then (List size1 elems1 low1 high1) else (List size2 elems2 low2 high2)

