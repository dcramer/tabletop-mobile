export const ADD_COLLECTION_SUCCESS = 'ADD_COLLECTION_SUCCESS';
export const ADD_COLLECTION_FAILURE = 'ADD_COLLECTION_FAILURE';
export const ADD_GAME_TO_COLLECTION_SUCCESS = 'ADD_GAME_TO_COLLECTION_SUCCESS';
export const ADD_GAME_TO_COLLECTION_FAILURE = 'ADD_GAME_TO_COLLECTION_FAILURE';
export const REMOVE_GAME_FROM_COLLECTION_SUCCESS = 'REMOVE_GAME_FROM_COLLECTION_SUCCESS';
export const REMOVE_GAME_FROM_COLLECTION_FAILURE = 'REMOVE_GAME_FROM_COLLECTION_FAILURE';
export const UPDATE_COLLECTION_SUCCESS = 'UPDATE_COLLECTION_SUCCESS';
export const UPDATE_COLLECTION_FAILURE = 'UPDATE_COLLECTION_FAILURE';

const initialState = {
  addCollectionError: false,
  addCollectionErrorMessage: '',
  updateCollectionError: false,
  updateCollectionErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_COLLECTION_FAILURE:
      return {
        ...state,
        addCollectionError: true,
        addCollectionErrorMessage: action.error.message,
      };
    case ADD_COLLECTION_SUCCESS:
      return {
        ...state,
        addCollectionError: false,
        addCollectionErrorMessage: '',
      };
    case UPDATE_COLLECTION_FAILURE:
      return {
        ...state,
        updateCollectionError: true,
        updateCollectionErrorMessage: action.error.message,
      };
    case UPDATE_COLLECTION_SUCCESS:
      return {
        ...state,
        updateCollectionError: false,
        updateCollectionErrorMessage: '',
      };
    default:
      return state;
  }
};
