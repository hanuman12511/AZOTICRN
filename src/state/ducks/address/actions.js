import * as types from "./types";

export const getAddress = (payload) => ({
  type: types.GET_ADDRESS,
  payload,
});

export const addAddress = (payload) => ({
  type: types.ADD_ADDRESS,
  payload,
});

export const deleteAddress = (payload) => ({
  type: types.DELETE_ADDRESS,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
