import * as actions from './actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';
import * as loaderActions from '../loader/actions';

export const uploadToken = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.uploadToken(response));
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
export const notificationList = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.notificationList(response));
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
export const getNotificationCount =
  (url, params, isToken) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.getNotificationCount(response));
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
export const resetNotificationCount =
  (url, params, isToken) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.resetNotificationCount(response));
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
export const contactUs = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.contactUs(response));
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
export const saveUserLatLong =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.saveUserLatLong(response));
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
