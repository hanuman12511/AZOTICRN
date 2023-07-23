import * as types from "./types";
import { combineReducers } from "redux";

const viewProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VIEW_PROFILE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const updateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_PROFILE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const favouriteProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FAVOURITE_PRODUCTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  viewProfile: viewProfileReducer,
  updateProfile: updateProfileReducer,
  favouriteProducts: favouriteProductsReducer,
});

export default reducer;
