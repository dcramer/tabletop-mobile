export const LIKE_FAILURE = 'LIKE_FAILURE';
export const LIKE_SUCCESS = 'LIKE_SUCCESS';

const initialState = {
  likeError: false,
  likeErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LIKE_FAILURE:
      return {
        ...state,
        likeError: true,
        likeErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
