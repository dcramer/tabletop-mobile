import { combineReducers } from 'redux';

import auth from './auth';
import games from './games';
import checkIns from './checkIns';
import publishers from './publishers';

export default combineReducers({
  auth,
  games,
  checkIns,
  publishers,
});
