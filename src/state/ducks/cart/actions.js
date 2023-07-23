import * as types from "./types";

export const addToCart = (payload) => ({
  type: types.ADD_TO_CART,
  payload,
});

export const getCartList = (payload) => ({
  type: types.GET_CART_LIST,
  payload,
});

export const deleteCart = (payload) => ({
  type: types.DELETE_CART,
  payload,
});

export const checkout = (payload) => ({
  type: types.CHECKOUT,
  payload,
});

export const deleteCartItem = (payload) => ({
  type: types.DELETE_CART_ITEM,
  payload,
});

export const placeOrder = (payload) => ({
  type: types.PLACE_ORDER,
  payload,
});

export const getCartCount = (payload) => ({
  type: types.GET_CART_COUNT,
  payload,
});

export const updateCart = (payload) => ({
  type: types.UPDATE_CART,
  payload,
});

export const verifyPayment = (payload) => ({
  type: types.VERIFY_PAYMENT,
  payload,
});

export const getFavouites = (payload) => ({
  type: types.GET_FAVOUITES,
  payload,
});

export const getPromoCodes = (payload) => ({
  type: types.GET_PROMO_CODES,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
