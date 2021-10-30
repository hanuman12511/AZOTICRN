import * as types from "./types";

export const uploadToken = (payload) => ({
  type: types.UPLOAD_TOKEN,
  payload,
});
export const notificationList = (payload) => ({
  type: types.NOTIFICATION_LIST,
  payload,
});
export const getNotificationCount = (payload) => ({
  type: types.GET_NOTIFICATION_COUNT,
  payload,
});
export const resetNotificationCount = (payload) => ({
  type: types.RESET_NOTIFICATION_COUNT,
  payload,
});
export const contactUs = (payload) => ({
  type: types.CONTACT_US,
  payload,
});
export const saveUserLatLong = (payload) => ({
  type: types.SAVE_USER_LAT_LONG,
  payload,
});

export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
