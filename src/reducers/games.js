export const ADD_GAME_SUCCESS = 'ADD_GAME_SUCCESS';
export const ADD_GAME_FAILURE = 'ADD_GAME_FAILURE';
export const UPDATE_GAME_SUCCESS = 'UPDATE_GAME_SUCCESS';
export const UPDATE_GAME_FAILURE = 'UPDATE_GAME_FAILURE';

const initialState = {
  addGameError: false,
  addGameErrorMessage: '',
  updateGameError: false,
  updateGameErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_GAME_FAILURE:
      return {
        ...state,
        addGameError: true,
        addGameErrorMessage: action.error.message,
      };
    case ADD_GAME_SUCCESS:
      return {
        ...state,
        addGameError: false,
        addGameErrorMessage: '',
      };
    case UPDATE_GAME_FAILURE:
      return {
        ...state,
        updateGameError: true,
        updateGameErrorMessage: action.error.message,
      };
    case UPDATE_GAME_SUCCESS:
      return {
        ...state,
        updateGameError: false,
        updateGameErrorMessage: '',
      };
    default:
      return state;
  }
};
