export const isAddToCart = (state) => {
  return state.cart.addToCart;
};
export const isGetCartList = (state) => {
  return state.cart.getCartList;
};
export const isDeleteCart = (state) => {
  return state.cart.deleteCart;
};
export const isCheckout = (state) => {
  return state.cart.checkout;
};
export const isDeleteCartItem = (state) => {
  return state.cart.deleteCartItem;
};
export const isPlaceOrder = (state) => {
  return state.cart.placeOrder;
};
export const isGetCartCount = (state) => {
  return state.cart.getCartCount;
};
export const isUpdateCart = (state) => {
  return state.cart.updateCart;
};
export const isVerifyPayment = (state) => {
  return state.cart.verifyPayment;
};
export const isGetFavouites = (state) => {
  return state.cart.getFavouites;
};
export const isGetPromoCodes = (state) => {
  return state.cart.getPromoCodes;
};
