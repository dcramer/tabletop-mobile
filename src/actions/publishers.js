import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_PUBLISHER_SUCCESS, ADD_PUBLISHER_FAILURE } from '../reducers/publishers';
import api from '../api';

const GQL_PUBLISHER_FRAGMENT = gql`
  fragment PublisherFragment on Publisher {
    id
    name
  }
`;

const GQL_LIST_PUBLISHERS = gql`
  query Publishers($query: String) {
    publishers(query: $query) {
      ...PublisherFragment
    }
  }
  ${GQL_PUBLISHER_FRAGMENT}
`;

const GQL_ADD_PUBLISHER = gql`
  mutation AddPublisher($name: String!) {
    addPublisher(name: $name) {
      ok
      errors
      publisher {
        ...PublisherFragment
      }
    }
  }
  ${GQL_PUBLISHER_FRAGMENT}
`;

export function getPublishers(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_PUBLISHERS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.publishers);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addPublisher(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_PUBLISHER,
          variables: data,
        })
        .then(resp => {
          let { addPublisher } = resp.data;
          if (addPublisher.ok) {
            resolve(addPublisher.publisher);
            return dispatch(addPublisherSuccess(addPublisher.publisher));
          } else {
            reject(addPublisher.errors);
            return dispatch(addPublisherFailure(addPublisher.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addPublisherFailure(error));
        });
    });
  };
}

export function addPublisherSuccess(publisher) {
  return {
    type: ADD_PUBLISHER_SUCCESS,
    publisher,
  };
}

export function addPublisherFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_PUBLISHER_FAILURE,
    error,
  };
}
