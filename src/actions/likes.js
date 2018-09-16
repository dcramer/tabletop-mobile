import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import { LIKE_SUCCESS, LIKE_FAILURE } from '../reducers/likes';
import api from '../api';

const GQL_LIST_LIKES = gql`
  query LikesQuery($createdBy: UUID, $checkin: UUID) {
    likes(createdBy: $createdBy, checkin: $checkin) {
      ...LikeFragment
    }
  }
`;

const GQL_ADD_LIKE = gql`
  mutation AddLike($checkin: UUID!) {
    addLike(checkin: $checkin) {
      ok
      errors
    }
  }
`;

const GQL_REMOVE_LIKE = gql`
  mutation RemoveLike($checkin: UUID!) {
    removeLike(checkin: $checkin) {
      ok
      errors
    }
  }
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
            resolve({ checkin: data.checkin });
            return dispatch(addLikeSuccess({ checkin: data.checkin }));
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

export function addLikeSuccess() {
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

export function removeLike(data) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_REMOVE_LIKE,
          variables: data,
        })
        .then(resp => {
          let { removeLike } = resp.data;
          if (removeLike.ok) {
            resolve({ checkin: data.checkin });
            return dispatch(removeLikeSuccess({ checkin: data.checkin }));
          } else {
            reject(removeLike.errors);
            return dispatch(removeLikeFailure(removeLike.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(removeLikeFailure(error));
        });
    });
  };
}

export function removeLikeSuccess(like) {
  return {
    type: LIKE_SUCCESS,
    like,
  };
}

export function removeLikeFailure(error) {
  Sentry.captureException(error);

  return {
    type: LIKE_FAILURE,
    error,
  };
}
