import * as types from './types';

export const saveLoggedInUser = (payload) => ({
  type: types.SAVE_LOGGED_IN_USER,
  payload,
});

export const resetLoggedInUser = () => ({
  type: types.RESET_LOGGED_IN_USER,
});
