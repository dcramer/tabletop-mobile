import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { ADD_BRAND_SUCCESS, ADD_BRAND_FAILURE } from '../reducers/brands';
import api from '../api';

const GQL_BRAND_FRAGMENT = gql`
  fragment BrandFragment on Brand {
    id
    name
  }
`;

const GQL_LIST_BRANDS = gql`
  query Brands($query: String) {
    brands(query: $query) {
      ...BrandFragment
    }
  }
  ${GQL_BRAND_FRAGMENT}
`;

const GQL_ADD_BRAND = gql`
  mutation AddBrand($name: String!, $region: UUID!) {
    addBrand(name: $name, region: $region) {
      ok
      errors
      brand {
        ...BrandFragment
      }
    }
  }
  ${GQL_BRAND_FRAGMENT}
`;

export function getBrands(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_BRANDS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.brands);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addBrand(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_BRAND,
          variables: data,
        })
        .then(resp => {
          let { addBrand } = resp.data;
          if (addBrand.ok) {
            resolve(addBrand.brand);
            return dispatch(addBrandSuccess(addBrand.brand));
          } else {
            reject(addBrand.errors);
            return dispatch(addBrandFailure(addBrand.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addBrandFailure(error));
        });
    });
  };
}

export function addBrandSuccess(brand) {
  return {
    type: ADD_BRAND_SUCCESS,
    brand,
  };
}

export function addBrandFailure(error) {
  Sentry.captureException(error);

  return {
    type: ADD_BRAND_FAILURE,
    error,
  };
}
