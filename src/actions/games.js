import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_GAME_SUCCESS, ADD_GAME_FAILURE } from '../reducers/games';
import api from '../api';

export const GQL_GAME_FRAGMENT = gql`
  fragment GameFragment on Game {
    id
    name
    yearPublished
    minPlayers
    maxPlayers
    duration
  }
`;

export const GQL_LIST_GAMES = gql`
  query Game($query: String) {
    games(query: $query) {
      ...GameFragment
    }
  }
  ${GQL_GAME_FRAGMENT}
`;

export const GQL_ADD_GAME = gql`
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
  ${GQL_GAME_FRAGMENT}
`;

export function getGames(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_GAMES,
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
          mutation: GQL_ADD_GAME,
          variables: data,
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
