import * as actions from './actions';
import * as loaderActions from '../loader/actions';
import {makeNetworkRequest} from '../../utils/makeNetworkRequest';

export const liveStories = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.liveStories(response));
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

export const commentPost = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.commentPost(response));
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

export const likePost = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.likePost(response));
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

export const newsFeed = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);
    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.newsFeed(response));
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

export const viewComments =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.viewComments(response));
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

export const viewLikes = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.viewLikes(response));
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

export const sharePost = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.sharePost(response));
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

export const commentDelete =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.commentDelete(response));
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

export const reportOrBlock =
  (url, params, isToken, isJson) => async dispatch => {
    try {
      // dispatch(loaderActions.processing(true));
      const response = await makeNetworkRequest(url, params, isToken, isJson);

      if (response) {
        const {success} = response;

        if (success) {
          dispatch(actions.reportOrBlock(response));
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

export const addReaction = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.addReaction(response));
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

export const postDetail = (url, params, isToken, isJson) => async dispatch => {
  try {
    // dispatch(loaderActions.processing(true));
    const response = await makeNetworkRequest(url, params, isToken, isJson);

    if (response) {
      const {success} = response;

      if (success) {
        dispatch(actions.postDetail(response));
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
