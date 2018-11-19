import { Sentry } from 'react-native-sentry';

import api from '../api';
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
import {
  ListCollectionsQuery,
  ListCollectionGamesQuery,
  AddCollectionMutation,
  AddGameToCollectionMutation,
  RemoveGameFromCollectionMutation,
  UpdateCollectionMutation,
} from '../queries/collections';

export function getCollections(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: ListCollectionsQuery,
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
          query: ListCollectionGamesQuery,
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

export function addCollection(data, currentUser) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      console.error(getState());
      api
        .mutate({
          mutation: AddCollectionMutation,
          variables: data,
          refetchQueries: currentUser
            ? [
                {
                  query: ListCollectionsQuery,
                  variables: { createdBy: currentUser.id },
                },
              ]
            : [],
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

export function addGameToCollection(data, currentUser) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let refetchQueries = [
        {
          query: ListCollectionGamesQuery,
          variables: { id: data.collection },
        },
      ];
      if (currentUser) {
        refetchQueries.push({
          query: ListCollectionsQuery,
          variables: { createdBy: currentUser.id, game: data.game },
        });
        refetchQueries.push({
          query: ListCollectionsQuery,
          variables: { createdBy: currentUser.id },
        });
      }

      api
        .mutate({
          mutation: AddGameToCollectionMutation,
          variables: data,
          refetchQueries,
        })
        .then(resp => {
          let { addGameToCollection } = resp.data;
          if (addGameToCollection.ok) {
            resolve(addGameToCollection.collection, addGameToCollection.game);
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

export function removeGameFromCollection(data, currentUser) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let refetchQueries = [
        {
          query: ListCollectionGamesQuery,
          variables: { id: data.collection },
        },
      ];
      if (currentUser) {
        refetchQueries.push({
          query: ListCollectionsQuery,
          variables: { createdBy: currentUser.id, game: data.game },
        });
        refetchQueries.push({
          query: ListCollectionsQuery,
          variables: { createdBy: currentUser.id },
        });
      }

      api
        .mutate({
          mutation: RemoveGameFromCollectionMutation,
          variables: data,
          refetchQueries,
        })
        .then(resp => {
          let { removeGameFromCollection } = resp.data;
          if (removeGameFromCollection.ok) {
            resolve(removeGameFromCollection.collection, removeGameFromCollection.game);
            return dispatch(
              removeGameFromCollectionSuccess(
                removeGameFromCollection.collection,
                removeGameFromCollection.game
              )
            );
          } else {
            reject(removeGameFromCollection.errors);
            return dispatch(removeGameFromCollectionFailure(removeGameFromCollection.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(removeGameFromCollectionFailure(error));
        });
    });
  };
}

export function updateCollection(data, currentUser) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let refetchQueries = [
        {
          query: ListCollectionGamesQuery,
          variables: { id: data.collection },
        },
      ];
      if (currentUser) {
        refetchQueries.push({
          query: ListCollectionsQuery,
          variables: { createdBy: currentUser.id },
        });
      }
      if (data.games && currentUser) {
        refetchQueries.push(
          ...data.games.map(gId => ({
            query: ListCollectionsQuery,
            variables: { createdBy: currentUser.id, game: gId },
          }))
        );
      }

      api
        .mutate({
          mutation: UpdateCollectionMutation,
          variables: data,
          refetchQueries,
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
