import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Libraries
import SafeAreaView from 'react-native-safe-area-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CountDown from 'react-native-countdown-component';

// styles
import basicStyles from '../styles/BasicStyles';

// Components
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';
import {checkPermission} from '../firebase_api/FirebaseAPI';
import RNOtpVerify from 'react-native-otp-verify';
// UserPreference
import {KEYS, storeData, getData} from 'state/utils/UserPreference';

// API

import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      otp: '',
      otps: '',
      otpActive: false,
      isEnabled: false,
      isHide: true,
      isAutoFilled: false,
      count: 40,
    };
    this.otpRef = null;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    if (Platform.os === 'Android') {
      this.getHash();
    }
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
    RNOtpVerify.removeListener();
  }

  getHash = () => {
    RNOtpVerify.getHash().then(console.log).catch(console.log);
    this.startListeningForOtp();
  };

  startListeningForOtp = () => {
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => console.log(p));
  };

  otpHandler = message => {
    const otp = /(\d{4})/g.exec(message)[1];

    this.setState({isAutoFilled: true});
    this.setState({otp});
    this.handleOTPActive(otp);
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  handleNumChange = async () => {
    this.props.navigation.pop();
  };

  handleLogin = async () => {
    // Fetching Data
    const info = this.props.navigation.getParam('info', null);
    const {mobile} = info;

    const {otp} = this.state;

    // validations
    if (otp.trim() === '') {
      Alert.alert('', 'Please enter OTP!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);
      const {deviceId} = deviceInfo;

      // starting loader
      this.setState({isProcessing: true});

      // Preparing Params
      const params = {
        mobile,
        otp,
        deviceId,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/loginOtpVerify',
        params,
        false,
        false,
      );
      // processing response
      if (response) {
        this.setState({
          isProcessing: false,
        });
        const {success, message, userInfo, isProfileUpdate, address} = response;
        

        if (success) {
          if (isProfileUpdate === false) {
            this.props.navigation.push('SignUp', {
              info: {
                mobile,
              },
            });
          } else {
            await storeData(KEYS.USER_INFO, userInfo);

            // Navigating To Logged In
            showToast(message);
            this.props.navigation.navigate('Home');
            await checkPermission();
          }
        } else {
          Alert.alert('Alert!', message);
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
    // }
  };

  handleResendOtp = async () => {
    // Fetching Data
    const info = this.props.navigation.getParam('info', null);
    const {mobile} = info;

    try {
      // starting loader
      this.setState({isProcessing: true});

      // Preparing Params
      const params = {
        mobile,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/resendOtp',
        params,
        false,
        false,
      );
      // processing response
      if (response) {
        // stopping loader
        this.setState({
          isProcessing: false,
        });
        const {success, message} = response;

        if (success) {
          this.setState({
            isProcessing: false,
            isHide: true,
            isEnabled: false,
            count: 40,
          });

          showToast(message);
        } else {
          Alert.alert('Alert!', message, [{text: 'OK'}], {
            cancelable: false,
          });
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOTPChange = otp => {
    this.setState({isAutoFilled: false, otp});
  };

  handleOTPActives = otp => {
    if (otp.length === 4) {
      this.setState({otpActive: true});
    } else {
      this.setState({otpActive: false});
    }
  };

  handleOTPActive = otp => {
    if (otp.length === 4) {
      this.setState({otpActive: true});
    } else {
      this.setState({otpActive: false});
    }
  };

  handleEnable = () => {
    this.setState({
      isHide: false,
      isEnabled: true,
    });
  };

  handleReference = async ref => {
    this.otpRef = ref;

    this.otpRef.current.notifyCodeChanged();
  };

  render() {
    const {otpActive, isEnabled, count, isHide, isAutoFilled} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.mainContainer}>
          <KeyboardAwareScrollView
            style={[basicStyles.flexOne, basicStyles.marginTop]}>
            <Text style={styles.otpText}>Enter OTP</Text>
            {isAutoFilled ? (
              <OTPInputView
                code={this.state.otp}
                style={styles.otpContainer}
                pinCount={4}
                autoFocusOnLoad
                // placeholderCharacter="*"
                placeholderTextColor="#BDBDBD"
                codeInputFieldStyle={styles.underlineStyleBase}
                onCodeChanged={this.handleOTPActive}
                onCodeFilled={this.handleOTPChange}
                value={this.state.otp}
              />
            ) : (
              <OTPInputView
                style={styles.otpContainer}
                pinCount={4}
                autoFocusOnLoad
                // placeholderCharacter="*"
                placeholderTextColor="#BDBDBD"
                codeInputFieldStyle={styles.underlineStyleBase}
                onCodeChanged={this.handleOTPActives}
                onCodeFilled={this.handleOTPChange}
                value={this.state.otp}
              />
            )}

            {/* </View> */}

            {otpActive ? (
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleLogin}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.button, {backgroundColor: '#bbbbbb'}]}>
                <Text style={styles.buttonText}>Continue</Text>
              </View>
            )}

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyCenter,
                basicStyles.alignCenter,
              ]}>
              <Text style={styles.otpReceived}>Don't receive the OTP? </Text>
              <TouchableOpacity onPress={this.handleNumChange}>
                <Text style={styles.otpResend}>Change Number</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.or}>Or</Text>

            <View style={styles.otpButton}>
              {isEnabled ? (
                <TouchableOpacity onPress={this.handleResendOtp}>
                  <Text style={styles.otpResend}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <View onPress={this.handleResendOtp}>
                  <Text style={[styles.otpResend, {color: '#666'}]}>
                    Resend OTP In
                  </Text>
                </View>
              )}
              {isHide ? (
                <View style={{marginLeft: wp(0.5)}}>
                  <CountDown
                    until={count}
                    size={10}
                    onFinish={this.handleEnable}
                    digitStyle={{backgroundColor: '#fff'}}
                    digitTxtStyle={{
                      color: '#f57c00',
                      fontSize: wp(4),
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: '', s: ''}}
                    showSeparator
                    separatorStyle={{color: '#f57c00'}}
                  />
                </View>
              ) : null}
            </View>
          </KeyboardAwareScrollView>
        </View>
        {/* </ImageBackground> */}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(4),
  },
  topSpace: {
    height: hp(30),
  },
  logoContainer: {
    backgroundColor: '#f2f1f1',
    height: wp(40),
    width: wp(40),
    borderRadius: wp(20),
    alignSelf: 'center',
    marginTop: wp(-22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    height: wp(7),
    aspectRatio: 4.48 / 1,
    alignSelf: 'center',
  },
  topMargin: {
    marginTop: hp(4),
  },

  signText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(3),
    marginBottom: hp(3),
    textAlign: 'center',
  },

  otpText: {
    fontSize: wp(6.5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(3),
    marginBottom: hp(4),
  },

  underlineStyleBase: {
    color: '#333',
    backgroundColor: '#9995',
    width: hp(6.2),
    marginRight: wp(1),
    height: hp(6.2),
    borderRadius: wp(1),
    borderWidth: 0,
    fontSize: wp(5.6),
    fontWeight: '700',
  },

  otpContainer: {
    marginLeft: wp(0),
    width: wp(70),
    height: hp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp(3),
  },
  button: {
    borderRadius: wp(1.5),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    backgroundColor: '#f57c00',
    marginTop: hp(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
  resetText: {
    color: '#f57c00',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  otpReceived: {
    color: '#808080',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: wp(4),
  },
  or: {
    color: '#808080',
    textAlign: 'center',
    fontWeight: '400',
    marginVertical: wp(2),
    fontSize: wp(4),
  },
  otpResend: {
    color: '#f57c00',
    textAlign: 'center',
    fontWeight: '400',
    marginVertical: wp(2),
    fontSize: wp(4),
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#f57c00',
  },
  otpButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
