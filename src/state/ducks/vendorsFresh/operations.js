import * as actions from './actions';
import * as loaderActions from '../loader/actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';

export const getFoodVendorList =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const followVendor =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const vendorProducts =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const vendorGalleryListing =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const getFarmVendorList =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const liveProducts =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const getProductDetail =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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
export const searchProducts =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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

export const liveFarmProducts =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

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

export const addToFavourite =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.addToFavourite(response));
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
