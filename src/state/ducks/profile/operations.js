import * as actions from './actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';
import * as loaderActions from '../loader/actions';

export const profile = requestConfig => async dispatch => {
  try {
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.profile(response));
      } else {
        dispatch(actions.error(response));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
  }
};

export const updateProfile = requestConfig => async dispatch => {
  try {
    dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(requestConfig);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.updateProfile(response));
        dispatch(loaderActions.processing(false));
      } else {
        dispatch(actions.error(response));
        dispatch(loaderActions.processing(false));
      }
    }
  } catch (error) {
    dispatch(actions.error(error));
    dispatch(loaderActions.processing(false));
  }
};
