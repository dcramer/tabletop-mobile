export const ADD_GAME_SUCCESS = 'ADD_GAME_SUCCESS';
export const ADD_GAME_FAILURE = 'ADD_GAME_FAILURE';

const initialState = {
  addGameError: false,
  addGameErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_GAME_FAILURE:
      return {
        ...state,
        addGameError: true,
        addGameErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
