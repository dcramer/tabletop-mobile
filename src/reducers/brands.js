export const ADD_BRAND_SUCCESS = 'ADD_BRAND_SUCCESS';
export const ADD_BRAND_FAILURE = 'ADD_BRAND_FAILURE';

const initialState = {
  addBrandError: false,
  addBrandErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BRAND_FAILURE:
      return {
        ...state,
        addBrandError: true,
        addBrandErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
