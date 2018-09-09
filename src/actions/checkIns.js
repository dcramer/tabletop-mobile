import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkins';
import { GQL_GAME_FRAGMENT } from './games';
import api from '../api';

const GQL_CHECKIN_FRAGMENT = gql`
  fragment CheckinFragment on Checkin {
    id
    game {
      ...GameFragment
    }
    players {
      id
      name
    }
    createdAt
  }
  ${GQL_GAME_FRAGMENT}
`;

const GQL_LIST_CHECKINS = gql`
  query CheckinsQuery($createdBy: UUID, $scope: CheckinScope, $game: UUID) {
    checkins(createdBy: $createdBy, scope: $scope, game: $game) {
      ...CheckinFragment
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

const GQL_ADD_CHECKIN = gql`
  mutation AddCheckin(
    $game: UUID!
    $notes: String
    $rating: Decimal
    $players: [UUID]
    $winners: [UUID]
  ) {
    addCheckin(game: $game, notes: $notes, rating: $rating, players: $players, winners: $winners) {
      ok
      errors
      checkin {
        ...CheckinFragment
      }
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

export function getCheckins(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_CHECKINS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.checkins);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addCheckin(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_CHECKIN,
          variables: data,
          update: (store, { data: { addCheckin } }) => {
            const data = store.readQuery({ query: GQL_LIST_CHECKINS });
            store.writeQuery({
              query: GQL_LIST_CHECKINS,
              data: {
                ...data,
                checkins: [addCheckin, ...data.checkins],
              },
            });
          },
        })
        .then(resp => {
          let { addCheckin } = resp.data;
          if (addCheckin.ok) {
            resolve(addCheckin.checkin);
            return dispatch(addCheckinSuccess(addCheckin.checkin));
          } else {
            reject(addCheckin.errors);
            return dispatch(addCheckinFailure(addCheckin.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addCheckinFailure(error));
        });
    });
  };
}

export function addCheckinSuccess(checkin) {
  return {
    type: CHECK_IN_SUCCESS,
    checkin,
  };
}

export function addCheckinFailure(error) {
  Sentry.captureException(error);

  return {
    type: CHECK_IN_FAILURE,
    error,
  };
}
