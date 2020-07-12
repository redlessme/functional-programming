module BinTree where

data BinTree = Nil | Node Int BinTree BinTree
  deriving (Show)

-- $setup
-- >>> tree = Node 16 (Node 23 Nil (Node 73 Nil Nil)) (Node 42 Nil Nil)
-- >>> one = Node 1 Nil Nil

-- | Find the depth of a tree (number of levels)
--
-- >>> depth Nil
-- 0
--
-- >>> depth (Node 1 Nil Nil)
-- 1
--
-- >>> depth tree
-- 3
depth :: BinTree -> Int
depth = undefined

-- | Find the number of nodes in a tree.
--
-- >>> size Nil
-- 0
--
-- >>> size one
-- 1
--
-- >>> size tree
-- 4
size :: BinTree -> Int
size = undefined

-- | Sum the elements of a numeric tree.
--
-- >>> sumTree Nil
-- 0
--
-- >>> sumTree one
-- 1
--
-- >>> sumTree tree
-- 154
--
-- prop> sumTree (Node v Nil Nil) == v
sumTree :: BinTree -> Int
sumTree = undefined

-- | Find the minimum element in a tree.
-- | Should throw an error if you pass in an empty tree.
-- | Thus, your base case should look like: minTree <your pattern here> = error "Tree is empty"
-- | hint: use one of the functions you created above
-- | to test if a subtree is empty without throwing this error.
--
-- >>> minTree one
-- 1
--
-- >>> minTree tree
-- 16
--
minTree :: BinTree -> Int
minTree = undefined

-- | Map a function over a tree.
--
-- >>> mapTree (+1) Nil
-- Nil
--
-- >>> mapTree (*1) one
-- Node 1 Nil Nil
--
-- >>> mapTree ((flip mod) 2) tree
-- Node 0 (Node 1 Nil (Node 1 Nil Nil)) (Node 0 Nil Nil)
mapTree :: (Int -> Int) -> BinTree -> BinTree
mapTree = undefined
