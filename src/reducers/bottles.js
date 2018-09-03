export const ADD_BOTTLE_SUCCESS = 'ADD_BOTTLE_SUCCESS';
export const ADD_BOTTLE_FAILURE = 'ADD_BOTTLE_FAILURE';

const initialState = {
  addBottleError: false,
  addBottleErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOTTLE_FAILURE:
      return {
        ...state,
        addBottleError: true,
        addBottleErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
