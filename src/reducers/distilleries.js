export const ADD_DISTILLERY_SUCCESS = 'ADD_DISTILLERY_SUCCESS';
export const ADD_DISTILLERY_FAILURE = 'ADD_DISTILLERY_FAILURE';

const initialState = {
  addDistilleryError: false,
  addDistilleryErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_DISTILLERY_FAILURE:
      return {
        ...state,
        addDistilleryError: true,
        addDistilleryErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
