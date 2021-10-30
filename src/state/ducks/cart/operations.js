import * as actions from "./actions";
import * as loaderActions from "../loader/actions";
import { makeNetworkRequest } from "../../utils";

export const addToCart = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.addToCart(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const getCartList = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getCartList(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const deleteCart = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.deleteCart(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const checkout = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.checkout(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const deleteCartItem = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.deleteCartItem(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const placeOrder = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.placeOrder(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const getCartCount = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getCartCount(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const updateCart = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.updateCart(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const verifyPayment = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.verifyPayment(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const getFavouites = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getFavouites(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
export const getPromoCodes = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getPromoCodes(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    } else {
      dispatch(actions.error(null));
      dispatch(loaderActions.processing(false));
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
