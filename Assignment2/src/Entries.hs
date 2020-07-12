{-# LANGUAGE OverloadedStrings #-}
module Entries(
  writeTournament,
  readPlayers,
  playerScoreFile
  )
where

import Data.Csv
import OhTypes
import qualified Data.ByteString.Lazy as BL
import qualified Data.Vector as V

data Entry = Entry {_name :: FilePath, _games :: Int, _elo :: Float}

entryHeader :: Header
entryHeader = header ["name", "games", "elo"]

playerScoreFile :: FilePath
playerScoreFile = "players.csv"

instance FromNamedRecord Entry where
  parseNamedRecord r = Entry <$> r .: "name" <*> r .: "games" <*> r .: "elo"

instance ToNamedRecord Entry where
    toNamedRecord (Entry name games elo) = namedRecord [
        "name" .= name, "games" .= games, "elo".= elo]

readPlayers :: IO [(FilePath, Int, Float)]
readPlayers = do
  s <- BL.readFile playerScoreFile
  let players = case decodeByName s of
        Left err -> error err
        Right (_, v) -> V.toList $ V.map (\(Entry n g e) -> (n, g, e)) v
  return players

writeTournament :: [Player] -> IO ()
writeTournament updatedPlayers = do
  let entries = map (\(Player pid _ _ elo games) -> Entry pid games elo) updatedPlayers
  BL.writeFile playerScoreFile (encodeByName entryHeader entries)
