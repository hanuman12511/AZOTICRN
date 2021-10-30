import * as actions from "./actions";
import * as loaderActions from "../loader/actions";
import { makeNetworkRequest } from "../../utils";

export const getFoodVendorList = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getFoodVendorList(response));
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
export const followVendor = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.followVendor(response));
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
export const vendorProducts = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.vendorProducts(response));
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
export const vendorGalleryListing = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.vendorGalleryListing(response));
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
export const getFarmVendorList = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getFarmVendorList(response));
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
export const liveProducts = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.liveProducts(response));
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
export const getProductDetail = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getProductDetail(response));
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
export const searchProducts = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.searchProducts(response));
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
export const liveFarmProducts = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.liveFarmProducts(response));
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
