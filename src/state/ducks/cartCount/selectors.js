export const saveCartCount = (state) => {
  if (Object.keys(state.cartCount).length === 0) {
    return null;
  } else {
    return state.cartCount;
  }
};
