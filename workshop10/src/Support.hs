module Support where

import Functor
import Applicative hiding ((<$>))
import Monad hiding ((<*>))
import System.IO
import Control.Applicative(liftA2)
import qualified Prelude as P((<$>), (<*>), pure, (=<<))

instance Functor IO where
  (<$>) = (P.<$>)

instance Applicative IO where
  pure = P.pure
  (<*>) = (P.<*>)

instance Monad IO where
  (=<<) = (P.=<<)

instance Functor ((->) t) where
  (<$>) = (P.<$>)

instance Applicative ((->) t) where
  pure = P.pure
  (<*>) = (P.<*>)

instance Monad ((->) t) where
  (=<<) = (P.=<<)

lift :: (Applicative f) => (a -> b -> c) -> f a -> f b -> f c
lift f a b = f <$> a <*> b
