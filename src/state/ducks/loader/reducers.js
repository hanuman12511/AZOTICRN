import * as types from './types';
import {combineReducers} from 'redux';

const fetchingReducer = (state = false, action) => {
  switch (action.type) {
    case types.IS_FETCHING:
      return action.payload;
    default:
      return state;
  }
};

const processingReducer = (state = false, action) => {
  switch (action.type) {
    case types.IS_PROCESSING:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isFetching: fetchingReducer,
  isProcessing: processingReducer,
});

export default reducer;
