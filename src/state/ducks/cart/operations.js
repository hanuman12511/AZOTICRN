import * as actions from './actions';
import * as loaderActions from '../loader/actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';

export const addToCart = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const getCartList = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const deleteCart = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const checkout = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const deleteCartItem = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const placeOrder = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const getCartCount = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const updateCart = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const verifyPayment = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const getFavouites = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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

export const getPromoCodes = (url, params) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

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
