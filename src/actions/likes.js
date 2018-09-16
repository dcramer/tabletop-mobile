import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { LIKE_SUCCESS, LIKE_FAILURE } from '../reducers/likes';
import api from '../api';

const GQL_LIKE_FRAGMENT = gql`
  fragment LikeFragment on Like {
    id
    createdAt
  }
`;

const GQL_LIST_LIKES = gql`
  query LikesQuery($createdBy: UUID, $checkin: UUID) {
    likes(createdBy: $createdBy, checkin: $checkin) {
      ...LikeFragment
    }
  }
  ${GQL_LIKE_FRAGMENT}
`;

const GQL_ADD_LIKE = gql`
  mutation AddLike($checkin: UUID!) {
    addLike(checkin: $checkin) {
      ok
      errors
      like {
        ...LikeFragment
      }
    }
  }
  ${GQL_LIKE_FRAGMENT}
`;

export function getLikes(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_LIKES,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.likes);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function addLike(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_ADD_LIKE,
          variables: data,
        })
        .then(resp => {
          let { addLike } = resp.data;
          if (addLike.ok) {
            resolve(addLike.like);
            return dispatch(addLikeSuccess(addLike.like));
          } else {
            reject(addLike.errors);
            return dispatch(addLikeFailure(addLike.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(addLikeFailure(error));
        });
    });
  };
}

export function addLikeSuccess(like) {
  return {
    type: LIKE_SUCCESS,
    like,
  };
}

export function addLikeFailure(error) {
  Sentry.captureException(error);

  return {
    type: LIKE_FAILURE,
    error,
  };
}
