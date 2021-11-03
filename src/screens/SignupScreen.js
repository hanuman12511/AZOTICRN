import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';

// Permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Native Components
import ImagePicker from 'react-native-image-picker';

// styles
import basicStyles from '../styles/BasicStyles';

// Images
import ic_edit_black from '../assets/icons/ic_edit_black.png';

// Icons
import ic_uncheckbox from '../assets/icons/ic_uncheckbox.png';
import ic_checkbox from '../assets/icons/ic_checkbox.png';
import userIcon from '../assets/images/userIcon.png';

// Components
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';
import DateTimePicker from '../components/DateTimePicker';
import uploadToken from '../firebase_api/UploadTokenAPI';

// UserPreference
import {KEYS, storeData, getData} from 'state/utils/UserPreference';

// VectorIcons

// Validations
import {isMobileNumber, isEmailAddress} from '../validations/FormValidator';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class StartScreen extends Component {
  constructor(props) {
    super(props);
    const info = props.navigation.getParam('info', null);

    this.state = {
      isProcessing: false,
      name: '',
      email: '',
      gender: null,
      dob: null,
      userImage: null,
      userPic: null,
      mobile: info.mobile,
      selectMale: false,
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

  handleSignUp = async () => {
    // dismissing keyboard
    Keyboard.dismiss();

    const {name, mobile, email, gender, userPic, dob} = this.state;

    // validations
    if (name.trim() === '') {
      Alert.alert('Alert!', 'Please enter your name!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (!isEmailAddress(email)) {
      Alert.alert(
        'Alert!',
        'Please enter a valid email address!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (gender === null) {
      Alert.alert('Alert!', 'Please select gender!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (dob === null) {
      Alert.alert('Alert!', 'Please select dob!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        name,
        email,
        mobile,
        dob,
        image: userPic,
        gender,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/registration',
        params,
      );

      // processing response
      if (response) {
        // stopping loader
        this.setState({
          isProcessing: false,
        });

        const {success, message, userInfo, isProfileUpdate} = response;

        if (success) {
          await storeData(KEYS.USER_INFO, userInfo);

          await uploadToken();

          // Navigating To Logged In
          this.props.navigation.push('VendorRecommendation');
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

  handleName = changedText => {
    this.setState({name: changedText});
  };

  handleEmail = changedText => {
    this.setState({email: changedText});
  };

  handleMobile = changedText => {
    this.setState({mobile: changedText});
  };

  handleMale = async () => {
    const {selectMale} = this.state;
    this.setState({
      selectMale: !selectMale,
      selectFemale: false,
      selectOther: false,
      gender: 'Male',
    });
  };

  handleFemale = async () => {
    const {selectFemale} = this.state;
    this.setState({
      selectFemale: !selectFemale,
      selectMale: false,
      selectOther: false,
      gender: 'Female',
    });
  };

  handleOther = async () => {
    const {selectOther} = this.state;
    this.setState({
      selectOther: !selectOther,
      selectFemale: false,
      selectMale: false,
      gender: 'Other',
    });
  };

  handleDob = selectedDate => {
    this.setState({dob: selectedDate});
  };

  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  handleImagePick = async () => {
    try {
      ImagePicker.showImagePicker(
        {
          noData: true,
          mediaType: 'photo',
          maxWidth: 500,
          maxHeight: 500,
          quality: 0.5,
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            if (Platform.OS === 'android') {
              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: response.fileName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: response.fileName,
              });
            } else if (Platform.OS === 'ios') {
              let imgName = response.name;

              if (typeof fileName === 'undefined') {
                const {uri} = response;
                // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
                var getFilename = uri.split('/');
                imgName = getFilename[getFilename.length - 1];
              }

              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: imgName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: imgName,
              });
            }
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {selectMale, selectFemale, selectOther, userImage} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={styles.formContainer}>
          <Text style={styles.signupHeading}>Profile Details</Text>

          <KeyboardAwareScrollView
            style={[basicStyles.flexOne, basicStyles.marginTop]}>
            <View styles={styles.profileContainer}>
              <TouchableOpacity
                style={styles.userEditIconContainer}
                onPress={this.handleImagePick}>
                <Image
                  source={ic_edit_black}
                  resizeMode="cover"
                  style={styles.userEditIcon}
                />
              </TouchableOpacity>

              {userImage !== null ? (
                <View style={styles.profileBorder}>
                  <Image
                    source={{uri: userImage}}
                    resizeMode="cover"
                    style={styles.userImage}
                  />
                </View>
              ) : (
                <View style={styles.profileBorder}>
                  <Image
                    source={userIcon}
                    resizeMode="cover"
                    style={styles.userImage}
                  />
                </View>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={this.state.name}
              onChangeText={this.handleName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={this.state.email}
              onChangeText={this.handleEmail}
            />

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.mainCheckContainer,
              ]}>
              {selectMale === true ? (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleMale}>
                  <Text style={styles.checkBoxText}>Male</Text>
                  <Image
                    source={ic_checkbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleMale}>
                  <Text style={styles.checkBoxText}>Male</Text>
                  <Image
                    source={ic_uncheckbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              )}

              {selectFemale === true ? (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleFemale}>
                  <Text style={styles.checkBoxText}>Female</Text>
                  <Image
                    source={ic_checkbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleFemale}>
                  <Text style={styles.checkBoxText}>Female</Text>
                  <Image
                    source={ic_uncheckbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              )}

              {selectOther === true ? (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleOther}>
                  <Text style={styles.checkBoxText}>Other</Text>
                  <Image
                    source={ic_checkbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.checkContainer}
                  onPress={this.handleOther}>
                  <Text style={styles.checkBoxText}>Other</Text>
                  <Image
                    source={ic_uncheckbox}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                </TouchableOpacity>
              )}
            </View>

            <DateTimePicker onDateChange={this.handleDob} />

            <TouchableOpacity
              onPress={this.handleSignUp}
              style={[
                basicStyles.orangeBgColor,
                basicStyles.button,
                styles.signUpButton,
              ]}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Create Profile
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>

        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  appName: {
    fontSize: wp(5),
    fontWeight: '700',
    marginBottom: hp(5),
    alignSelf: 'center',
  },
  topSpace: {
    height: hp(20),
    alignItems: 'flex-end',
  },
  icons: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  signupHeading: {
    fontSize: wp(6.5),
    fontWeight: '700',
    color: '#333',
    marginTop: hp(3),
    marginBottom: hp(4),
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
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(4),
  },
  loginHeading: {
    marginBottom: hp(3),
  },
  appLogo: {
    height: wp(7),
    aspectRatio: 4.48 / 1,
    alignSelf: 'center',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FAFAFA',
    borderRadius: hp(3),
    paddingHorizontal: wp(2),
    marginBottom: hp(2),
  },
  input: {
    fontSize: wp(4),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    height: hp(5.5),
    backgroundColor: '#FAFAFA',
    marginBottom: wp(3),
  },
  signUpButton: {
    borderRadius: wp(1.5),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
    backgroundColor: '#F57C00',
  },
  backToStart: {
    borderColor: '#f57c00',
    borderWidth: 1,
    alignSelf: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: wp(2),
    borderRadius: wp(6),
    marginTop: hp(2),
  },
  mainCheckContainer: {
    marginBottom: wp(3),
  },
  checkContainer: {
    flexDirection: 'row',
    width: wp(29),
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
    height: hp(6),
    padding: wp(1),
    paddingLeft: wp(2),
    alignItems: 'center',
    borderRadius: wp(1.5),
  },
  checkBoxText: {
    fontSize: wp(4),
    color: '#333',
  },
  checkIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginTop: wp(-5),
  },
  profileContainer: {
    width: wp(30),
    alignSelf: 'center',
  },
  profileBorder: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(14),
    borderWidth: 1,
    borderColor: '#ccc8',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp(3),
  },
  userImage: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(12.5),
  },
  userEditIconContainer: {
    height: wp(7),
    width: wp(7),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 9,
    alignSelf: 'center',
    top: wp(2),
    right: wp(32),
  },
  userEditIcon: {
    height: wp(4),
    width: wp(4),
  },
});
