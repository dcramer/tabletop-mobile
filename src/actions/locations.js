import gql from 'graphql-tag';

import api from '../api';

const GQL_LIST_LOCATIONS = gql`
  query LocationsQuery($query: String) {
    locations(query: $query) {
      id
      name
    }
  }
`;

export function getLocations(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_LOCATIONS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.locations);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}
