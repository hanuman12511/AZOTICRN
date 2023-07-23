import * as types from "./types";

export const viewProfile = (payload) => ({
  type: types.VIEW_PROFILE,
  payload,
});
export const updateProfile = (payload) => ({
  type: types.UPDATE_PROFILE,
  payload,
});
export const favouriteProducts = (payload) => ({
  type: types.FAVOURITE_PRODUCTS,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
