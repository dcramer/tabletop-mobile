import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import {
  ADD_COLLECTION_SUCCESS,
  ADD_COLLECTION_FAILURE,
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
  query ListCollections($query: String, $createdBy: UUID, $id: UUID) {
    collections(query: $query, createdBy: $createdBy, id: $id) {
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

export const GQL_UPDATE_COLLECTION = gql`
  mutation UpdateCollection($collection: UUID!, $name: String!) {
    updateCollection(collection: $collection, name: $name) {
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
