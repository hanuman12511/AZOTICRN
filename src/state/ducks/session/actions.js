import * as types from "./types";

export const login = (payload) => ({
  type: types.LOGIN,
  payload,
});
export const loginOtpVerify = (payload) => ({
  type: types.LOGIN_OTP_VERIFY,
  payload,
});
export const resendOtp = (payload) => ({
  type: types.RESEND_OTP,
  payload,
});
export const registration = (payload) => ({
  type: types.REGISTRATION,
  payload,
});
export const vendorRecommendation = (payload) => ({
  type: types.VENDOR_RECOMMENDATION,
  payload,
});
export const error = (payload) => ({
  type: types.ERROR,
  payload,
});
