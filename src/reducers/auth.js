export const CHECK_AUTH = 'CHECK_AUTH';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

const initialState = {
  validToken: null,
  isAuthenticating: false,
  user: null,

  loginError: false,
  loginErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticating: true,
        loginError: false,
        loginErrorMessage: '',
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        validToken: true,
        isAuthenticating: false,
        loginError: false,
        loginErrorMessage: '',
        user: action.user,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        validToken: false,
        isAuthenticating: false,
        loginError: true,
        loginErrorMessage: action.error,
      };
    case LOGOUT:
      return {
        ...initialState,
        validToken: false,
      };
    default:
      return state;
  }
};
