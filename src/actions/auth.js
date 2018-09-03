import { Alert, AsyncStorage } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';
import gql from 'graphql-tag';

import api from '../api';

import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../reducers/auth';

const GQL_LOGIN = gql`
  mutation LoginMutation($facebookToken: String!) {
    login(facebookToken: $facebookToken) {
      ok
      errors
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const GQL_GET_VIEWER = gql`
  query ViewerQuery {
    me {
      id
      email
      name
    }
  }
`;

export const fetchSession = async () => {
  try {
    let session = await AsyncStorage.getItem('@cask:auth');
    if (!session) return {};
    return await JSON.parse(session);
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const storeSession = async session => {
  await AsyncStorage.setItem(`@cask:auth`, JSON.stringify(session));
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem(`@cask:auth`);
  } catch (e) {}
};

export const loginFacebook = () => {
  return dispatch => {
    dispatch(login());
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      result => {
        if (!result.isCancelled) {
          dispatch(refreshSession());
        }
      },
      error => {
        dispatch(loginFailure(error.message));
      }
    );
  };
};

export function refreshSession() {
  return dispatch => {
    return new Promise((resolve, reject) => {
      AccessToken.getCurrentAccessToken()
        .then(data => {
          api
            .mutate({
              mutation: GQL_LOGIN,
              variables: { facebookToken: data.accessToken },
            })
            .then(async resp => {
              let { login } = resp.data;
              if (login.ok) {
                await storeSession({
                  token: login.token,
                });
                dispatch(loginSuccess(login.user));
                resolve();
              } else {
                dispatch(loginFailure(login.errors));
                reject(login.errors);
              }
            })
            .catch(error => {
              dispatch(loginFailure(error.message));
              reject(error);
            });
        })
        .catch(error => {
          dispatch(loginFailure(error.message));
          reject(error);
        });
    });
  };
}

export function getUserInfo() {
  return dispatch => {
    api
      .query({
        query: GQL_GET_VIEWER,
      })
      .then(resp => {
        dispatch(loginSuccess(resp.data.viewer));
      })
      .catch(error => {
        dispatch(loginFailure(error.message));
      });
  };
}

export function login() {
  return {
    type: LOGIN,
  };
}

export function logOut() {
  return dispatch => {
    clearSession();
    api.resetStore();
    dispatch({
      type: LOGOUT,
    });
  };
}

export function loginSuccess(user) {
  return async dispatch => {
    return dispatch({
      type: LOGIN_SUCCESS,
      user,
    });
  };
}

export function loginFailure(error) {
  return async dispatch => {
    Sentry.captureException(error);

    await AsyncStorage.removeItem('@cask:auth');

    return dispatch({
      type: LOGIN_FAILURE,
      error,
    });
  };
}
