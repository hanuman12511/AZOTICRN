import * as actions from './actions';
import * as loaderActions from '../loader/actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';

export const login = (url, params) => async dispatch => {
  try {
    dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.login(response));
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
export const loginOtpVerify = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.loginOtpVerify(response));
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
export const resendOtp = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.resendOtp(response));
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
export const registration = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.registration(response));
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
export const vendorRecommendation = requestConfig => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.vendorRecommendation(response));
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
