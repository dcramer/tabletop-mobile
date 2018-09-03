export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';
export const UNFOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';

const initialState = {
  addFriendError: false,
  addFriendErrorMessage: '',
  removeFriendError: false,
  removeFriendErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FOLLOW_USER_FAILURE:
      return {
        ...state,
        addFriendError: true,
        addFriendErrorMessage: action.error.message,
      };
    case UNFOLLOW_USER_FAILURE:
      return {
        ...state,
        removeFriendError: true,
        removeFriendErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
