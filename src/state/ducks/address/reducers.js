import * as types from "./types";
import { combineReducers } from "redux";

const getAddressReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ADDRESS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const addAddressReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_ADDRESS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const deleteAddressReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_ADDRESS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getAddress: getAddressReducer,
  addAddress: addAddressReducer,
  deleteAddress: deleteAddressReducer,
});

export default reducer;
