import { combineReducers } from 'redux';

import auth from './auth';
import games from './games';
import checkins from './checkins';
import publishers from './publishers';

export default combineReducers({
  auth,
  games,
  checkins,
  publishers,
});
