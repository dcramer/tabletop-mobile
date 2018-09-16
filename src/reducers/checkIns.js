export const ADD_CHECKIN_FAILURE = 'ADD_CHECKIN_FAILURE';
export const ADD_CHECKIN_SUCCESS = 'ADD_CHECKIN_SUCCESS';
export const LOAD_CHECKIN = 'LOAD_CHECKIN';
export const LIKE_CHECKIN_FAILURE = 'LIKE_CHECKIN_FAILURE';
export const LIKE_CHECKIN_SUCCESS = 'LIKE_CHECKIN_SUCCESS';
export const UNLIKE_CHECKIN_FAILURE = 'UNLIKE_CHECKIN_FAILURE';
export const UNLIKE_CHECKIN_SUCCESS = 'UNLIKE_CHECKIN_SUCCESS';

const initialState = {
  checkinCache: {},
  addCheckinError: false,
  addCheckinErrorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHECKIN:
    case UNLIKE_CHECKIN_SUCCESS:
    case LIKE_CHECKIN_SUCCESS:
      let { checkin } = action;
      return {
        ...state,
        checkinCache: {
          ...state.checkinCache,
          [checkin.id]: checkin,
        },
      };
    case ADD_CHECKIN_FAILURE:
      return {
        ...state,
        addCheckinError: true,
        addCheckinErrorMessage: action.error.message,
      };
    default:
      return state;
  }
};
