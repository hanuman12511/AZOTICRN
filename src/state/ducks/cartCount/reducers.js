import * as types from "./types";

const cartCountReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_CART_COUNT:
      return action.payload;

    default:
      return state;
  }
};

export default cartCountReducer;
