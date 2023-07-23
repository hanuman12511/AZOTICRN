import * as types from "./types";

export const saveCartCount = (payload) => ({
  type: types.SAVE_CART_COUNT,
  payload,
});
