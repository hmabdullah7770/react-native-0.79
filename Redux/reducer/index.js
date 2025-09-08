import { combineReducers } from 'redux';
import auth from './Auth';
import states from './states'
import category from './Categoury'
import storeproduct from './storee/Store_Product'

const rootReducer = combineReducers({
  auth: auth,
  States: states,
  category: category,
  storeproduct : storeproduct 
});

export default rootReducer;
