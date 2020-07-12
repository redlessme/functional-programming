                                                               module RockPaperScissors where

data RockPaperScissors = Rock | Paper | Scissors

-- The classes for this type are given for free
data Result = Player1 | Player2 | None
  deriving(Eq, Show)

-- $setup
-- >>> import Control.Applicative
-- >>> rps = [Rock, Paper, Scissors]
-- >>> combinations = liftA2 (,) rps rps
-- >>> insight f = map (liftA2 f fst snd)

class Functor (f :: * -> *) where
  (<$>)::Functor f=>(a->b)->f a=>f b

class Functor f => Applicative (f :: * -> *) where
pure::a->f a
(<*>)::f(a->b)->f a->f b
class Foldable (t :: * -> *) where
foldMap::Monoid m=>(a->m)->t a->m
foldr::(a->b->b)->b->t a->b
foldl::(a->b->a)->a->tb->a
foldMap::Monoid m=>(a->m)->t a->m
(>>=)::m a->(a->m b)->m b
(=<<)::(a->m b)->m a->m b
traverse::(a->f b)->t a->f (t b)
sequenceA::t(f a)->f(t a)
-- | A hand should print as:
--  * Rock: 'R'
--  * Paper: 'P'
--  * Scissors: 'S'
--
-- >>> map show rps
-- ["R","P","S"]
instance Show RockPaperScissors where
  show Rock="R"
  show Paper="P"
  show Scissors="S"

-- | Equality between members.
--
-- >>> insight (==) combinations
-- [True,False,False,False,True,False,False,False,True]
instance Eq RockPaperScissors where
  (==) Rock Rock=True
  (==) Paper Paper=True
  (==) Scissors Scissors=True
  (==) _ _=False

-- | Ordering to determine winning moves.
--
-- >>> insight compare combinations
-- [EQ,LT,GT,GT,EQ,LT,LT,GT,EQ]
instance Ord RockPaperScissors where
  compare Rock Rock=EQ
  compare Paper Paper=EQ
  compare Scissors Scissors=EQ
  compare Rock Paper=LT
  compare Rock Scissors=GT
  compare Paper Rock=GT
  compare Paper Scissors=LT
  compare Scissors Rock=LT
  compare Scissors Paper=GT

-- | Tell which player won.
--
-- >>> insight whoWon combinations
-- [None,Player2,Player1,Player1,None,Player2,Player2,Player1,None]
whoWon :: RockPaperScissors -> RockPaperScissors -> Result
whoWon a b=if a <b then Player2 else if a>b then Player1 else None

-- | True if the first player has won @n@ or more times.
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Paper]
-- True
--
-- >>> competition 2 [Paper, Paper, Paper, Scissors] [Rock, Scissors, Rock, Paper]
-- True
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Scissors]
-- False
--
-- >>> competition 2 [Rock, Paper, Paper, Scissors] [Rock, Scissors, Rock, Rock]
-- False
competition :: Int -> [RockPaperScissors] -> [RockPaperScissors] -> Bool
competition n (x1:xs1) (x2:xs2) = if times (x1:xs1) (x2:xs2)>=n then True else False
  where
    times [] []=0
    times (x1:xs1) (x2:xs2)= if whoWon x1 x2==Player1 then 1+times xs1 xs2 else times xs1 xs2
