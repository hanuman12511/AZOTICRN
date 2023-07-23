import * as types from "./types";
import { combineReducers } from "redux";

const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const loginOtpVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN_OTP_VERIFY:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const resendOtpReducer = (state = {}, action) => {
  switch (action.type) {
    case types.RESEND_OTP:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const registrationReducer = (state = {}, action) => {
  switch (action.type) {
    case types.REGISTRATION:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};
const vendorRecommendationReducer = (state = {}, action) => {
  switch (action.type) {
    case types.VENDOR_RECOMMENDATION:
      return action.payload;
    case types.ERROR:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({
  login: loginReducer,
  loginOtpVerify: loginOtpVerifyReducer,
  resendOtp: resendOtpReducer,
  registration: registrationReducer,
  vendorRecommendation: vendorRecommendationReducer,
});

export default reducer;
