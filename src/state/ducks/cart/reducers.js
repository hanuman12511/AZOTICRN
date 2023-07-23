import * as types from './types';
import {combineReducers} from 'redux';

const addToCartReducer = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_TO_CART:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getCartListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CART_LIST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const deleteCartReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_CART:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const checkoutReducer = (state = {}, action) => {
  switch (action.type) {
    case types.CHECKOUT:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const deleteCartItemReducer = (state = {}, action) => {
  switch (action.type) {
    case types.DELETE_CART_ITEM:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const placeOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case types.PLACE_ORDER:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getCartCountReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CART_COUNT:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const updateCartReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPDATE_CART:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const verifyPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VERIFY_PAYMENT:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getFavouitesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_FAVOUITES:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getPromoCodesReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_PROMO_CODES:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  addToCart: addToCartReducer,
  getCartList: getCartListReducer,
  deleteCart: deleteCartReducer,
  checkout: checkoutReducer,
  deleteCartItem: deleteCartItemReducer,
  placeOrder: placeOrderReducer,
  getCartCount: getCartCountReducer,
  updateCart: updateCartReducer,
  verifyPayment: verifyPaymentReducer,
  getFavouites: getFavouitesReducer,
  getPromoCodes: getPromoCodesReducer,
});

export default reducer;
