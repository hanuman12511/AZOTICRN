export const isLogin = (state) => {
  return state.session.login;
};
export const isLoginOtpVerify = (state) => {
  return state.session.loginOtpVerify;
};
export const isResendOtp = (state) => {
  return state.session.resendOtp;
};
export const isRegistration = (state) => {
  return state.session.registration;
};
export const isVendorRecommendation = (state) => {
  return state.session.vendorRecommendation;
};
