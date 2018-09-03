import { combineReducers } from 'redux';

import auth from './auth';
import bottles from './bottles';
import checkIns from './checkIns';

export default combineReducers({
  auth,
  bottles,
  checkIns,
});
