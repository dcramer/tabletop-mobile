import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import {
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
} from '../reducers/users';
import api from '../api';

const GQL_USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    name
  }
`;

const GQL_LIST_USERS = gql`
  query Users($id: UUID, $query: String, $scope: UserScope) {
    users(id: $id, query: $query, scope: $scope) {
      ...UserFragment
    }
  }
  ${GQL_USER_FRAGMENT}
`;

const GQL_FOLLOW = gql`
  mutation Follow($user: UUID!) {
    follow(user: $user) {
      ok
      errors
      user {
        ...UserFragment
      }
    }
  }
  ${GQL_USER_FRAGMENT}
`;

const GQL_UNFOLLOW = gql`
  mutation Unfollow($user: UUID!) {
    unfollow(user: $user) {
      ok
      errors
      user {
        ...UserFragment
      }
    }
  }
  ${GQL_USER_FRAGMENT}
`;

export function getUsers(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .query({
          query: GQL_LIST_USERS,
          variables: params,
        })
        .then(resp => {
          resolve(resp.data.users);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export function follow(userId) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_FOLLOW,
          variables: { user: userId },
        })
        .then(resp => {
          let { follow } = resp.data;
          if (follow.ok) {
            resolve(follow.user);
            return dispatch(followSuccess(follow.checkIn));
          } else {
            reject(follow.errors);
            return dispatch(followFailure(follow.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(followFailure(error));
        });
    });
  };
}

export function unfollow(userId) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api
        .mutate({
          mutation: GQL_UNFOLLOW,
          variables: { user: userId },
        })
        .then(resp => {
          let { unfollow } = resp.data;
          if (unfollow.ok) {
            resolve(unfollow.user);
            return dispatch(unfollowSuccess(unfollow.checkIn));
          } else {
            reject(unfollow.errors);
            return dispatch(unfollowFailure(unfollow.errors));
          }
        })
        .catch(error => {
          reject(error);
          return dispatch(unfollowFailure(error));
        });
    });
  };
}

export function followSuccess(fromUserId, toUserId) {
  return {
    type: FOLLOW_USER_SUCCESS,
    fromUserId,
    toUserId,
  };
}

export function followFailure(error) {
  Sentry.captureException(error);

  return {
    type: FOLLOW_USER_FAILURE,
    error,
  };
}

export function unfollowSuccess(fromUserId, toUserId) {
  return {
    type: UNFOLLOW_USER_SUCCESS,
    fromUserId,
    toUserId,
  };
}

export function unfollowFailure(error) {
  Sentry.captureException(error);

  return {
    type: UNFOLLOW_USER_FAILURE,
    error,
  };
}
