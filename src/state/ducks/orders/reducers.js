import * as types from "./types";
import { combineReducers } from "redux";

const viewOrdersReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VIEW_ORDERS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const viewOrderDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VIEW_ORDER_DETAILS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const addRatingReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_RATING:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const cancelOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case types.CANCEL_ORDER:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  viewOrders: viewOrdersReducer,
  viewOrderDetails: viewOrderDetailsReducer,
  addRating: addRatingReducer,
  cancelOrder: cancelOrderReducer,
});

export default reducer;
