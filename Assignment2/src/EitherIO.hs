-- | Monad transformer for Either and IO, thanks to:
-- https://github.com/kqr/gists/blob/master/articles/gentle-introduction-monad-transformers.md#using
module EitherIO
  (
    EitherIO(..),
    liftEither, liftIO
  ) where

import Control.Applicative (liftA2)

newtype EitherIO e a = EitherIO{runEitherIO :: IO (Either e a)}

instance Functor (EitherIO e) where
  fmap f = EitherIO . fmap (fmap f) . runEitherIO

instance Applicative (EitherIO e) where
  pure    = EitherIO . return . Right
  f <*> x = EitherIO $ liftA2 (<*>) (runEitherIO f) (runEitherIO x)

instance Monad (EitherIO e) where
  return  = pure
  x >>= f = EitherIO $ runEitherIO x >>= either (return . Left) (runEitherIO . f)

liftEither :: Either e a -> EitherIO e a
liftEither x = EitherIO (return x)

liftIO :: IO a -> EitherIO e a
liftIO x = EitherIO (fmap Right x)
