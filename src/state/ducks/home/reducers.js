import * as types from "./types";
import { combineReducers } from "redux";

const uploadTokenReducer = (state = {}, action) => {
  switch (action.type) {
    case types.UPLOAD_TOKEN:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const notificationListReducer = (state = {}, action) => {
  switch (action.type) {
    case types.NOTIFICATION_LIST:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const getNotificationCountReducer = (state = {}, action) => {
  switch (action.type) {
    case types.GET_NOTIFICATION_COUNT:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const resetNotificationCountReducer = (state = {}, action) => {
  switch (action.type) {
    case types.RESET_NOTIFICATION_COUNT:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const contactUsReducer = (state = {}, action) => {
  switch (action.type) {
    case types.CONTACT_US:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const saveUserLatLongReducer = (state = {}, action) => {
  switch (action.type) {
    case types.SAVE_USER_LAT_LONG:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  uploadToken: uploadTokenReducer,
  notificationList: notificationListReducer,
  getNotificationCount: getNotificationCountReducer,
  resetNotificationCount: resetNotificationCountReducer,
  contactUs: contactUsReducer,
  saveUserLatLong: saveUserLatLongReducer,
});

export default reducer;
