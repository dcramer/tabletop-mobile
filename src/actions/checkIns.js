import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { CHECK_IN_SUCCESS, CHECK_IN_FAILURE } from '../reducers/checkIns';

import api from '../api';

const GQL_CHECKIN_FRAGMENT = gql`
  fragment CheckInFragment on CheckIn {
    id
    bottle {
      id
      name
      distillery {
        id
        name
      }
    }
    location {
      id
      name
    }
    rating
    notes
    createdBy {
      id
      name
    }
    createdAt
  }
`;

const GQL_LIST_CHECKINS = gql`
  query CheckInsQuery($createdBy: UUID, $scope: CheckInScope) {
    checkins(createdBy: $createdBy, scope: $scope) {
      ...CheckInFragment
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

const GQL_ADD_CHECKIN = gql`
  mutation AddCheckIn($bottle: UUID!, $notes: String, $rating: Decimal, $location: UUID) {
    addCheckIn(bottle: $bottle, notes: $notes, rating: $rating, location: $location) {
      ok
      errors
      checkIn {
        ...CheckInFragment
      }
    }
  }
  ${GQL_CHECKIN_FRAGMENT}
`;

export function getCheckIns(params) {
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

export function addCheckIn(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_CHECKIN,
          variables: data,
        })
        .then(resp => {
          let { addCheckIn } = resp.data;
          if (addCheckIn.ok) {
            resolve(addCheckIn.checkIn);
            return dispatch(addCheckInSuccess(addCheckIn.checkIn));
          } else {
            reject(addCheckIn.errors);
            return dispatch(addCheckInFailure(addCheckIn.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addCheckInFailure(error));
        });
    });
  };
}

export function addCheckInSuccess(checkIn) {
  return {
    type: CHECK_IN_SUCCESS,
    checkIn,
  };
}

export function addCheckInFailure(error) {
  Sentry.captureException(error);

  return {
    type: CHECK_IN_FAILURE,
    error,
  };
}
