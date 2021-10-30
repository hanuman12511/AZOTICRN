import * as types from "./types";

export const getFoodVendorList = (payload) => ({
  type: types.GET_FOOD_VENDOR_LIST,
  payload,
});
export const followVendor = (payload) => ({
  type: types.FOLLOW_VENDOR,
  payload,
});
export const vendorProducts = (payload) => ({
  type: types.VENDOR_PRODUCTS,
  payload,
});
export const vendorGalleryListing = (payload) => ({
  type: types.VENDOR_GALLERY_LISTING,
  payload,
});
export const getFarmVendorList = (payload) => ({
  type: types.GET_FARM_VENDOR_LIST,
  payload,
});
export const liveProducts = (payload) => ({
  type: types.LIVE_PRODUCTS,
  payload,
});
export const getProductDetail = (payload) => ({
  type: types.GET_PRODUCT_DETAIL,
  payload,
});
export const searchProducts = (payload) => ({
  type: types.SEARCH_PRODUCTS,
  payload,
});
export const liveFarmProducts = (payload) => ({
  type: types.LIVE_FARM_PRODUCTS,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
