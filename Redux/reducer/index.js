import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'
import category from './Categoury'

const rootReducer = combineReducers({
  auth: auth,
  States: states,
  category: category,
});

export default rootReducer;
