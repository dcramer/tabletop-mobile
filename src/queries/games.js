import gql from 'graphql-tag';

import { CollectionFragment, GameFragment } from '../fragments';

export const ListGamesQuery = gql`
  query Game($query: String) {
    games(query: $query) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

export const AddGameMutation = gql`
  mutation AddGame(
    $name: String!
    $yearPublished: Int
    $minPlayers: Int
    $maxPlayers: Int
    $duration: Int
    $durationType: DurationType
  ) {
    addGame(
      name: $name
      yearPublished: $yearPublished
      minPlayers: $minPlayers
      maxPlayers: $maxPlayers
      duration: $duration
      durationType: $durationType
    ) {
      ok
      errors
      game {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
`;

export const UpdateGameMutation = gql`
  mutation UpdateGame($game: UUID!, $collections: [UUID]) {
    updateGame(game: $game, collections: $collections) {
      ok
      errors
      game {
        ...GameFragment
        collections {
          ...CollectionFragment
        }
      }
    }
  }
  ${GameFragment}
  ${CollectionFragment}
`;
