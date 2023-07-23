import * as types from './types';

export const fetching = (payload) => ({
  type: types.IS_FETCHING,
  payload,
});

export const processing = (payload) => ({
  type: types.IS_PROCESSING,
  payload,
});
