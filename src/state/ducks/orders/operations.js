import * as actions from "./actions";
import * as loaderActions from "../loader/actions";
import { makeNetworkRequest } from "../../utils";

export const viewOrders = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.viewOrders(response));
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
export const viewOrderDetails = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.viewOrderDetails(response));
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
export const addRating = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.addRating(response));
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
export const cancelOrder = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.cancelOrder(response));
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
