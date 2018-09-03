import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_BOTTLE_SUCCESS, ADD_BOTTLE_FAILURE } from '../reducers/bottles';
import api from '../api';

const GQL_BOTTLE_FRAGMENT = gql`
  fragment BottleFragment on Bottle {
    id
    name
    distillery {
      id
      name
    }
    brand {
      id
      name
    }
    spiritType {
      id
      name
    }
    age
  }
`;

const GQL_LIST_BOTTLES = gql`
  query Bottle($query: String) {
    bottles(query: $query) {
      ...BottleFragment
    }
  }
  ${GQL_BOTTLE_FRAGMENT}
`;

const GQL_ADD_BOTTLE = gql`
  mutation AddBottle(
    $name: String!
    $distillery: UUID!
    $brand: UUID!
    $spiritType: UUID!
    $age: Int
  ) {
    addBottle(
      name: $name
      distillery: $distillery
      brand: $brand
      spiritType: $spiritType
      age: $age
    ) {
      ok
      errors
      bottle {
        ...BottleFragment
      }
    }
  }
  ${GQL_BOTTLE_FRAGMENT}
`;

export function getBottles(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_BOTTLES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.bottles);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addBottle(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_BOTTLE,
          variables: data,
        })
        .then(resp => {
          let { addBottle } = resp.data;
          if (addBottle.ok) {
            resolve(addBottle.bottle);
            return dispatch(addBottleSuccess(addBottle.bottle));
          } else {
            reject(addBottle.errors);
            return dispatch(addBottleFailure(addBottle.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addBottleFailure(error));
        });
    });
  };
}

export function addBottleSuccess(bottle) {
  return {
    type: ADD_BOTTLE_SUCCESS,
    bottle,
  };
}

export function addBottleFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BOTTLE_FAILURE,
    error,
  };
}
