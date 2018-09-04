export const ADD_PUBLISHER_SUCCESS = 'ADD_PUBLISHER_SUCCESS';
export const ADD_PUBLISHER_FAILURE = 'ADD_PUBLISHER_FAILURE';

const initialState = {
  addPublisherError: false,
  addPublisherErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PUBLISHER_FAILURE:
      return {
        ...state,
        addPublisherError: true,
        addPublisherErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
