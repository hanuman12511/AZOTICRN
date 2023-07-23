import * as types from './types';

const userInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_LOGGED_IN_USER:
      return action.payload;
    case types.RESET_LOGGED_IN_USER:
      return {};
    default:
      return state;
  }
};

export default userInfoReducer;
