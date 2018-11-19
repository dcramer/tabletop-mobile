import gql from 'graphql-tag';

import { CollectionFragment, GameFragment } from '../fragments';

export const ListCollectionsQuery = gql`
  query ListCollections($query: String, $game: UUID, $createdBy: UUID, $id: UUID) {
    collections(query: $query, game: $game, createdBy: $createdBy, id: $id) {
      ...CollectionFragment
      numGames
    }
  }
  ${CollectionFragment}
`;

export const ListCollectionGamesQuery = gql`
  query ListCollectionGames($id: UUID) {
    collections(id: $id) {
      id
      games {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
`;

export const AddCollectionMutation = gql`
  mutation AddCollection($name: String!, $description: String) {
    addCollection(name: $name, description: $description) {
      ok
      errors
      collection {
        ...CollectionFragment
      }
    }
  }
  ${CollectionFragment}
`;

export const AddGameToCollectionMutation = gql`
  mutation AddGameToCollection($collection: UUID!, $game: UUID!) {
    addGameToCollection(collection: $collection, game: $game) {
      ok
      errors
      collection {
        ...CollectionFragment
      }
      game {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
  ${CollectionFragment}
`;

export const RemoveGameFromCollectionMutation = gql`
  mutation RemoveGameFromCollection($collection: UUID!, $game: UUID!) {
    removeGameFromCollection(collection: $collection, game: $game) {
      ok
      errors
      collection {
        ...CollectionFragment
      }
      game {
        ...GameFragment
      }
    }
  }
  ${GameFragment}
  ${CollectionFragment}
`;

export const UpdateCollectionMutation = gql`
  mutation UpdateCollection(
    $collection: UUID!
    $name: String
    $description: String
    $games: [UUID]
  ) {
    updateCollection(
      collection: $collection
      name: $name
      description: $description
      games: $games
    ) {
      ok
      errors
      collection {
        ...CollectionFragment
        numGames
      }
    }
  }
  ${CollectionFragment}
`;
