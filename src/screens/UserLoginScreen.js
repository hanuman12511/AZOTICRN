import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Keyboard,
  Alert,
  ScrollView,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// styles
import basicStyles from '../styles/BasicStyles';

// Components
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';

// Icons
import ic_right_arrow from '../assets/icons/ic_right_arrow.png';

// Validations
import {isMobileNumber, isEmailAddress} from '../validations/FormValidator';

import {checkPermission} from '../firebase_api/FirebaseAPI';
import SmsRetriever from 'react-native-sms-retriever';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class UserLoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      mobile: '',
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleLogin = async () => {
    // dismissing keyboard
    Keyboard.dismiss();

    const {mobile} = this.state;

    // validations

    if (!isMobileNumber(mobile)) {
      Alert.alert('', 'Please enter a valid mobile number!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        mobile,
      };

      // calling api
      const response = await makeNetworkRequest('Customers/login', params);

      // processing response
      if (response) {
        // stopping loader
        this.setState({
          isProcessing: false,
        });

        const {success, message} = response;

        if (success) {
          // navigating to login screen

          this.props.navigation.push('Otp', {
            info: {
              mobile,
            },
          });

          await checkPermission();
          // success message
          // Alert.alert('', message, [{text: 'OK'}], {
          //   cancelable: false,
          // });
          showToast(message);
        } else {
          // error message
          Alert.alert('', message, [{text: 'OK'}], {
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

  handleMobileChange = mobile => {
    this.setState({mobile});
  };

  handleStart = () => {
    this.props.navigation.navigate('Login');
  };

  handleHome = () => {
    this.props.navigation.navigate('NewsNav');
  };

  handleSignup = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    const {isProcessing} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={[basicStyles.marginTop]}>
            <Text style={styles.signText}>Login/Sign Up</Text>
            <Text style={styles.subText}>
              Enter the Mobile Number you used to login
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Mobile No."
              placeholderTextColor="#999"
              maxLength={10}
              keyboardType="number-pad"
              value={this.state.mobile}
              onChangeText={this.handleMobileChange}
            />

            <TouchableOpacity
              underlayColor="#F57C0080"
              style={[styles.button3]}
              onPress={this.handleLogin}>
              <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                Get Otp
              </Text>
              <Image
                source={ic_right_arrow}
                resizeMode="cover"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              underlayColor="#F57C0080"
              style={[styles.button3]}
              onPress={this.handleHome}>
              <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                Continue Without Login
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {isProcessing && <ProcessingLoader />}
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
  input: {
    fontSize: wp(4),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    height: hp(5.5),
    backgroundColor: '#f2f1f1',
    marginBottom: wp(3),
    // color: '#333',
  },
  arrowIcon: {
    width: wp(6),
    height: wp(6),
    position: 'absolute',
    right: wp(3),
    top: wp(3.3),
  },
  button: {
    borderRadius: wp(1.5),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
  },

  orSecretor: {
    marginTop: hp(1),
    marginBottom: hp(5),
  },

  button3: {
    borderRadius: wp(1.5),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
    backgroundColor: '#F57C00',
  },
  signText: {
    fontSize: wp(6.5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(2.5),
    marginBottom: hp(4),
  },
  subText: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#333',
    marginBottom: hp(4),
  },
  venderRegister: {
    borderWidth: 1,
    borderColor: '#F57C00',
  },
  orText: {
    fontSize: wp(3.5),
    color: '#999',
  },
});
