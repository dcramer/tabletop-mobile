import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import {
  ADD_COLLECTION_SUCCESS,
  ADD_COLLECTION_FAILURE,
  ADD_GAME_TO_COLLECTION_SUCCESS,
  ADD_GAME_TO_COLLECTION_FAILURE,
  REMOVE_GAME_FROM_COLLECTION_SUCCESS,
  REMOVE_GAME_FROM_COLLECTION_FAILURE,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAILURE,
} from '../reducers/collections';
import api from '../api';

import { GQL_GAME_FRAGMENT } from './games';

export const GQL_COLLECTION_FRAGMENT = gql`
  fragment CollectionFragment on Collection {
    id
    name
  }
`;

export const GQL_LIST_COLLECTIONS = gql`
  query ListCollections($query: String, $game: UUID, $createdBy: UUID, $id: UUID) {
    collections(query: $query, game: $game, createdBy: $createdBy, id: $id) {
      ...CollectionFragment
    }
  }
  ${GQL_COLLECTION_FRAGMENT}
`;

export const GQL_LIST_COLLECTION_GAMES = gql`
  query ListCollectionGames($id: UUID) {
    collections(id: $id) {
      games {
        ...GameFragment
      }
    }
  }
  ${GQL_GAME_FRAGMENT}
`;

export const GQL_ADD_COLLECTION = gql`
  mutation AddCollection($name: String!) {
    addCollection(name: $name) {
      ok
      errors
      collection {
        ...CollectionFragment
      }
    }
  }
  ${GQL_COLLECTION_FRAGMENT}
`;

export const GQL_ADD_GAME_TO_COLLECTION = gql`
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
  ${GQL_GAME_FRAGMENT}
  ${GQL_COLLECTION_FRAGMENT}
`;

export const GQL_REMOVE_GAME_FROM_COLLECTION = gql`
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
  ${GQL_GAME_FRAGMENT}
  ${GQL_COLLECTION_FRAGMENT}
`;

export const GQL_UPDATE_COLLECTION = gql`
  mutation UpdateCollection($collection: UUID!, $name: String!, $games: [UUID]) {
    updateCollection(collection: $collection, name: $name, games: $games) {
      ok
      errors
      collection {
        ...CollectionFragment
      }
    }
  }
  ${GQL_COLLECTION_FRAGMENT}
`;

export function getCollections(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_COLLECTIONS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.collections);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function getCollectionGames(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_COLLECTION_GAMES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.collections[0].games);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addCollection(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_COLLECTION,
          variables: data,
        })
        .then(resp => {
          let { addCollection } = resp.data;
          if (addCollection.ok) {
            resolve(addCollection.collection);
            return dispatch(addCollectionSuccess(addCollection.collection));
          } else {
            reject(addCollection.errors);
            return dispatch(addCollectionFailure(addCollection.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addCollectionFailure(error));
        });
    });
  };
}

export function addGameToCollection(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_GAME_TO_COLLECTION,
          variables: data,
        })
        .then(resp => {
          let { addGameToCollection } = resp.data;
          if (addGameToCollection.ok) {
            resolve(addCollection.collection);
            return dispatch(
              addGameToCollectionSuccess(addGameToCollection.collection, addGameToCollection.game)
            );
          } else {
            reject(addCollection.errors);
            return dispatch(addGameToCollectionFailure(addGameToCollection.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addGameToCollectionFailure(error));
        });
    });
  };
}

export function removeGameFromCollection(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_GAME_TO_COLLECTION,
          variables: data,
        })
        .then(resp => {
          let { addGameToCollection } = resp.data;
          if (addGameToCollection.ok) {
            resolve(addCollection.collection);
            return dispatch(
              removeGameFromCollectionSuccess(
                addGameToCollection.collection,
                addGameToCollection.game
              )
            );
          } else {
            reject(addCollection.errors);
            return dispatch(removeGameFromCollectionFailure(addGameToCollection.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(removeGameFromCollectionFailure(error));
        });
    });
  };
}

export function updateCollection(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_UPDATE_COLLECTION,
          variables: data,
        })
        .then(resp => {
          let { updateCollection } = resp.data;
          if (updateCollection.ok) {
            resolve(updateCollection.collection);
            return dispatch(updateCollectionSuccess(updateCollection.collection));
          } else {
            reject(updateCollection.errors);
            return dispatch(updateCollectionFailure(updateCollection.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(updateCollectionFailure(error));
        });
    });
  };
}

export function addCollectionSuccess(collection) {
  return {
    type: ADD_COLLECTION_SUCCESS,
    collection,
  };
}

export function addCollectionFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_COLLECTION_FAILURE,
    error,
  };
}

export function addGameToCollectionSuccess(collection, game) {
  return {
    type: ADD_GAME_TO_COLLECTION_SUCCESS,
    collection,
    game,
  };
}

export function addGameToCollectionFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_GAME_TO_COLLECTION_FAILURE,
    error,
  };
}

export function removeGameFromCollectionSuccess(collection, game) {
  return {
    type: REMOVE_GAME_FROM_COLLECTION_SUCCESS,
    collection,
    game,
  };
}

export function removeGameFromCollectionFailure(error) {
  Sentry.captureException(error);

  return {
    type: REMOVE_GAME_FROM_COLLECTION_FAILURE,
    error,
  };
}

export function updateCollectionSuccess(collection) {
  return {
    type: UPDATE_COLLECTION_SUCCESS,
    collection,
  };
}

export function updateCollectionFailure(error) {
  Sentry.captureException(error);

  return {
    type: UPDATE_COLLECTION_FAILURE,
    error,
  };
}
