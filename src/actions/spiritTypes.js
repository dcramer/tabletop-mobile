import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import api from '../api';

const GQL_LIST_SPIRIT_TYPES = gql`
  query SpiritTypesQuery($query: String) {
    spiritTypes(query: $query) {
      id
      name
    }
  }
`;

export function getSpiritTypes(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_SPIRIT_TYPES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.spiritTypes);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}
