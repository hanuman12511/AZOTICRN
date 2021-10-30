import * as types from "./types";

export const viewOrders = (payload) => ({
  type: types.VIEW_ORDERS,
  payload,
});
export const viewOrderDetails = (payload) => ({
  type: types.VIEW_ORDER_DETAILS,
  payload,
});
export const addRating = (payload) => ({
  type: types.ADD_RATING,
  payload,
});
export const cancelOrder = (payload) => ({
  type: types.CANCEL_ORDER,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
