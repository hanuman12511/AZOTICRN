import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
// Responsive
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

// Images
import ic_profile_black from '../assets/icons/ic_profile_black.png';
import ic_phone_black from '../assets/icons/ic_phone_black.png';
import ic_mail_black from '../assets/icons/ic_mail_black.png';
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {clearData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    const userInfo = this.props.navigation.getParam('userInfo', null);
    const {name, mobile, email, image} = userInfo;

    this.state = {
      name,
      mobile,
      email,
      userImage: image,
      userPic: null,
      selectedFile: null,
      isProcessing: false,
    };
  }

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
        (response) => {
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

  handleUpdateProfile = async () => {
    const {name, userPic} = this.state;

    /*  if (!this.coords) {
      Alert.alert('', 'Please select current location', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    } */

    if (name.trim() === '') {
      Alert.alert('', 'Please enter Name', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting processing loader
      this.setState({isProcessing: true});
      // fetching userInfo
      // const userInfo = await getData(KEYS.USER_INFO);

      // preparing params
      const params = {
        name,
        image: userPic,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/updateProfile',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        // stopping loader
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          const {getParam, pop} = this.props.navigation;
          const refreshCallback = getParam('refreshCallback', null);

          pop();

          // refreshing list
          await refreshCallback(message);
          // showToast(message);
        } else {
          const {isAuthTokenExpired} = response;
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            return;
          }

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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };

  handleNameChange = (changedText) => {
    this.setState({name: changedText});
  };

  render() {
    const {userImage, name, mobile, email, isProcessing} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[styles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            navAction="back"
            headerTitle="Edit Profile"
            nav={this.props.navigation}
          />
          <View style={styles.profileContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.profileContainer}>
              <View style={styles.formContainer}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.profileHeader}>
                    <TouchableOpacity
                      style={styles.imageContainer}
                      onPress={this.handleImagePick}>
                      {userImage ? (
                        <Image
                          source={{uri: userImage}}
                          resizeMode="cover"
                          style={styles.paymentOptionIcon}
                        />
                      ) : (
                        <Image
                          source={ic_profile_black}
                          resizeMode="cover"
                          style={styles.paymentOptionIcon}
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.userName}>{name}</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_profile_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Name"
                      value={name}
                      onChangeText={this.handleNameChange}
                    />
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_phone_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text
                      style={styles.textInput}
                      // placeholder="Mobile"
                      // onChangeText={this.onEmailIdChange}
                    >
                      {mobile}
                    </Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_mail_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text
                      style={styles.textInput}
                      // placeholder="Mobile"
                      // onChangeText={this.onEmailIdChange}
                    >
                      {email}
                    </Text>
                  </View>

                  {/* <View style={styles.profileRow}>
                    <Image
                      source={ic_address_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="A3 Mall Road Vidhyadhar Nagar"
                      onChangeText={this.onEmailIdChange}
                    />
                  </View> */}

                  <TouchableOpacity
                    style={styles.saveButtonContainer}
                    onPress={this.handleUpdateProfile}>
                    <Text style={styles.saveButtonText}>Update</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </View>
            </ScrollView>
          </View>
        </View>
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: wp(2),
    paddingTop: hp(5),
  },
  editIcon: {
    alignSelf: 'flex-end',
    padding: wp(2),
  },
  editIconImage: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: wp(3.5),
    marginTop: hp(2),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f2f1f1',
    height: hp(7),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  logoutRow: {
    flexDirection: 'row',
  },
  infoIcon: {
    width: wp(4.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  userText: {
    fontSize: wp(3.5),
  },
  saveButtonContainer: {
    height: 36,
    paddingHorizontal: wp(10),
    backgroundColor: '#db9058',
    borderRadius: 18,
    justifyContent: 'center',
    marginTop: hp(3),
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    // backgroundColor: '#db9058',
    // width: wp(12),
    height: hp(12),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
  },
  nameText: {
    fontSize: wp(5),
    color: '#fff',
  },
  textInput: {
    fontSize: wp(3.2),
    flex: 1,
  },
  paymentOptionIcon: {
    height: hp(13.5),
    borderRadius: hp(8),
    aspectRatio: 1 / 1,
    // marginBottom: hp(2),
  },
});
