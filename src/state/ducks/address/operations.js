import * as actions from "./actions";
import * as loaderActions from "../loader/actions";
import { makeNetworkRequest } from "../../utils";

export const getAddress = (requestConfig) => async (dispatch) => {
  try {
    // dispatch(loaderActions.fetching(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.getAddress(response));
        dispatch(loaderActions.fetching(false));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const addAddress = (requestConfig) => async (dispatch) => {
  try {
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.addAddress(response));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const deleteAddress = (requestConfig) => async (dispatch) => {
  try {
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const { success } = response;

      if (success) {
        dispatch(actions.deleteAddress(response));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};
