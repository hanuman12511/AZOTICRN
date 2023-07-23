import * as types from './types';
import {combineReducers} from 'redux';

const getFoodVendorListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FOOD_VENDOR_LIST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const followVendorReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FOLLOW_VENDOR:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const vendorProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VENDOR_PRODUCTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const vendorGalleryListingReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VENDOR_GALLERY_LISTING:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getFarmVendorListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FARM_VENDOR_LIST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const liveProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_PRODUCTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getProductDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_PRODUCT_DETAIL:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const searchProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SEARCH_PRODUCTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const liveFarmProductsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LIVE_FARM_PRODUCTS:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const addToFavouriteReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_TO_FAVOURITE:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  getFoodVendorList: getFoodVendorListReducer,
  followVendor: followVendorReducer,
  vendorProducts: vendorProductsReducer,
  vendorGalleryListing: vendorGalleryListingReducer,
  getFarmVendorList: getFarmVendorListReducer,
  liveProducts: liveProductsReducer,
  getProductDetail: getProductDetailReducer,
  searchProducts: searchProductsReducer,
  liveFarmProducts: liveFarmProductsReducer,
  addToFavourite: addToFavouriteReducer,
});

export default reducer;
