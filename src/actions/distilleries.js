import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_DISTILLERY_SUCCESS, ADD_DISTILLERY_FAILURE } from '../reducers/distilleries';
import api from '../api';

const GQL_DISTILLERY_FRAGMENT = gql`
  fragment DistilleryFragment on Distillery {
    id
    name
    region {
      id
      name
      country {
        id
        name
      }
    }
  }
`;

const GQL_LIST_DISTILLERIES = gql`
  query Distilleries($query: String) {
    distilleries(query: $query) {
      ...DistilleryFragment
    }
  }
  ${GQL_DISTILLERY_FRAGMENT}
`;

const GQL_ADD_DISTILLERY = gql`
  mutation AddDistillery($name: String!, $region: UUID!) {
    addDistillery(name: $name, region: $region) {
      ok
      errors
      distillery {
        ...DistilleryFragment
      }
    }
  }
  ${GQL_DISTILLERY_FRAGMENT}
`;

export function getDistilleries(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_DISTILLERIES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.distilleries);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addDistillery(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_DISTILLERY,
          variables: data,
        })
        .then(resp => {
          let { addDistillery } = resp.data;
          if (addDistillery.ok) {
            resolve(addDistillery.distillery);
            return dispatch(addDistillerySuccess(addDistillery.distillery));
          } else {
            reject(addDistillery.errors);
            return dispatch(addDistilleryFailure(addDistillery.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addDistilleryFailure(error));
        });
    });
  };
}

export function addDistillerySuccess(distillery) {
  return {
    type: ADD_DISTILLERY_SUCCESS,
    distillery,
  };
}

export function addDistilleryFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_DISTILLERY_FAILURE,
    error,
  };
}
