export const COMMENT_FAILURE = 'COMMENT_FAILURE';
export const COMMENT_SUCCESS = 'COMMENT_SUCCESS';

const initialState = {
  commentError: false,
  commentErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case COMMENT_FAILURE:
      return {
        ...state,
        commentError: true,
        commentErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
