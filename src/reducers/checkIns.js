export const CHECK_IN_FAILURE = 'CHECK_IN_FAILURE';
export const CHECK_IN_SUCCESS = 'CHECK_IN_SUCCESS';

const initialState = {
  checkinError: false,
  checkinErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHECK_IN_FAILURE:
      return {
        ...state,
        checkinError: true,
        checkinErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
