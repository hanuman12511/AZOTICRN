export const getCartItemCount = state => {
  if (Object.keys(state).length === 0) {
    return null;
  } else {
    return state.cartItemCount;
  }
};
