import { Sentry } from 'react-native-sentry';

import {
  ADD_GAME_SUCCESS,
  ADD_GAME_FAILURE,
  UPDATE_GAME_SUCCESS,
  UPDATE_GAME_FAILURE,
} from '../reducers/games';
import { ListCollectionsQuery, ListCollectionGamesQuery } from '../queries/collections';
import { ListGamesQuery, AddGameMutation, UpdateGameMutation } from '../queries/games';
import api from '../api';

export function getGames(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: ListGamesQuery,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.games);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addGame(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: AddGameMutation,
          variables: data,
          refetchQueries: [
            {
              query: ListGamesQuery,
            },
          ],
        })
        .then(resp => {
          let { addGame } = resp.data;
          if (addGame.ok) {
            resolve(addGame.game);
            return dispatch(addGameSuccess(addGame.game));
          } else {
            reject(addGame.errors);
            return dispatch(addGameFailure(addGame.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addGameFailure(error));
        });
    });
  };
}

export function updateGame(data, currentUser) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let refetchQueries = [];
      if (data.collections !== undefined) {
        if (currentUser) {
          refetchQueries.push({
            query: ListCollectionsQuery,
            variables: { createdBy: currentUser.id, game: data.game },
          });
        }
        refetchQueries.push(
          ...data.collections.map(id => ({
            query: ListCollectionGamesQuery,
            variables: { id },
          }))
        );
      }
      api
        .mutate({
          mutation: UpdateGameMutation,
          variables: data,
          refetchQueries,
        })
        .then(resp => {
          let { updateGame } = resp.data;
          if (updateGame.ok) {
            resolve(updateGame.game);
            return dispatch(updateGameSuccess(updateGame.game));
          } else {
            reject(updateGame.errors);
            return dispatch(updateGameFailure(updateGame.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(updateGameFailure(error));
        });
    });
  };
}

export function addGameSuccess(game) {
  return {
    type: ADD_GAME_SUCCESS,
    game,
  };
}

export function addGameFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_GAME_FAILURE,
    error,
  };
}

export function updateGameSuccess(game) {
  return {
    type: UPDATE_GAME_SUCCESS,
    game,
  };
}

export function updateGameFailure(error) {
  Sentry.captureException(error);

  return {
    type: UPDATE_GAME_FAILURE,
    error,
  };
}
