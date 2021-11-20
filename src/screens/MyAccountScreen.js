import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  Platform,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';

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
import FooterComponent from '../components/FooterComponent';
import {showToast} from '../components/CustomToast';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';

// Styles
import BasicStyles from '../styles/BasicStyles';

// Icons
import ic_order_history from '../assets/icons/ic_order_history.png';
import ic_address_book from '../assets/icons/ic_address_book.png';
import ic_fav_order from '../assets/icons/ic_fav_order.png';
import ic_contact from '../assets/icons/ic_contact.png';
import ic_cam_white from '../assets/icons/ic_cam_white.png';
import ic_my_account_black from '../assets/icons/ic_my_account_black.png';
import ic_edit from '../assets/icons/ic_edit.png';
import ic_right from '../assets/icons/ic_right.png';

// Popup
import EditProfilePopup from '../components/PopUpComponents/EditProfilePopup';
import ChangePasswordPopup from '../components/PopUpComponents/ChangePasswordPopup';

// Styles
import basicStyles from '../styles/BasicStyles';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';

//UserPreference
import {clearData, KEYS, getData, storeData} from 'state/utils/UserPreference';

// API

import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

import RBSheet from 'react-native-raw-bottom-sheet';
export default class MyAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      editProfilePopup: false,
      isProcessing: false,
      userInfo: '',
      isListRefreshing: false,
      userImage: null,
      userPic: null,
      userName: '',
      bio: '',
      name: '',
    };
  }
  // UNSAFE_componentWillMount() {
  //   this._subscribe = this.props.navigation.addListener('didFocus', () => {
  //     this.fetchUserProfile();
  //   });
  // }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchUserProfile();
  }

  backAction = () => {
    if (this.state.editProfilePopup) {
      this.closePopup();
      return true;
    } else {
      this.props.navigation.navigate('Home');
      return true;
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchUserProfile = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);

      // if (userInfo) {
      //   const params = {
      //     userId,
      //   };
      let params = null;
      // calling api
      const response = await makeNetworkRequest(
        'Customers/viewProfile',
        params,
        true,
      );

      // Processing Response
      if (response) {
        this.setState({
          isLoading: false,
          isProcessing: false,
          contentLoading: false,
          isListRefreshing: false,
        });

        const {success} = response;

        if (success) {
          const {userInfo: userInfos} = response;

          const {userName, bio, image, name} = userInfos;

          this.setState({
            userInfo: userInfos,
            userImage: image,
            isLoading: false,
            isListRefreshing: false,
            userName,
            bio,
            name,
          });
          let userInfo = await getData(KEYS.USER_INFO);

          userInfo.image = image;
          await storeData(KEYS.USER_INFO, userInfo);
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          isListRefreshing: false,
        });
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

  // handleProfile = () => {
  //   this.props.navigation.navigate('MyProfile');
  // };
  handleOrderHistory = () => {
    this.props.navigation.navigate('Orders');
  };
  handleAddressBook = () => {
    this.props.navigation.navigate('AddressBook');
  };
  handleFavOrder = () => {
    this.props.navigation.navigate('FavoriteOrder');
  };
  handleContact = () => {
    this.props.navigation.navigate('Contact');
  };

  onLogoutYesPress = async () => {
    try {
      // Clearing user preferences from local storage
      await clearData();
      showToast('Logged Out');

      this.props.navigation.navigate('InitialSetup');
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: this.onLogoutYesPress},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMoreInfo = () => {
    // this.setState({editProfilePopup: true});
    this.RBSheet.open();
  };

  handleChangePassword = () => {
    this.setState({changePasswordPopup: true});
  };

  closePopup = () => {
    this.setState({editProfilePopup: false});
  };

  // closePopup = () => {
  //   this.setState({changePasswordPopup: false});
  // };

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

              this.setState(
                {
                  userPic: imageData,
                  userImage: response.uri,
                  userImageName: response.fileName,
                },
                async () => {
                  await this.handleUpdateProfile();
                },
              );
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

              this.setState(
                {
                  userPic: imageData,
                  userImage: response.uri,
                  userImageName: imgName,
                },
                async () => {
                  await this.handleUpdateProfile();
                },
              );
            }
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateProfile = async () => {
    const {userName, bio, userPic, name} = this.state;

    try {
      // starting processing loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        name,
        image: userPic,
        userName,
        bio,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/updateProfile',
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
          // refreshing list

          showToast(message);
          this.closePopup();
          await this.fetchUserProfile();
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

  handleNameChange = changedText => {
    this.setState({name: changedText});
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {userInfo, userImage, changePasswordPopup} = this.state;
    const {name, mobile, userName, bio, followedVendors, email, likedDished} =
      userInfo;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[BasicStyles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            navAction="back"
            showHeaderLogo
            showAccountIcon
            showCartIcon
            nav={this.props.navigation}
            headerTitle="My Account"
          />

          <ScrollView
            contentContainerStyle={[basicStyles.flexOne]}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            }>
            <View style={styles.profileContainer}>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={this.handleMoreInfo}>
                <Text style={basicStyles.orangeColor}>Edit Profile</Text>
              </TouchableOpacity>

              <View style={styles.profileViews}>
                {userImage !== null ? (
                  <View style={styles.profileView}>
                    <Image
                      source={{uri: userImage}}
                      resizeMode="cover"
                      style={styles.userImage}
                    />
                  </View>
                ) : (
                  <View style={styles.profileView}>
                    <Image
                      source={ic_my_account_black}
                      resizeMode="cover"
                      style={styles.userImage}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.editIconCircle}
                  onPress={this.handleImagePick}>
                  <Image
                    source={ic_cam_white}
                    resizeMode="cover"
                    style={styles.editIcon}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[basicStyles.heading, basicStyles.paddingTop]}>
                {name}
              </Text>

              {bio && bio !== 'null' ? (
                <Text
                  style={[
                    basicStyles.text,
                    basicStyles.textAlign,
                    {fontSize: wp(3), paddingHorizontal: wp(12)},
                  ]}>
                  {bio}
                </Text>
              ) : null}

              <View style={[basicStyles.directionRow, basicStyles.marginTop]}>
                <View
                  style={[
                    basicStyles.paddingHorizontal,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={[basicStyles.text, basicStyles.grayColor]}>
                    Followed Vendors
                  </Text>
                  <Text style={[basicStyles.heading]}>{followedVendors}</Text>
                </View>
                <View
                  style={[
                    basicStyles.paddingHorizontal,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={[basicStyles.text, basicStyles.grayColor]}>
                    Likes
                  </Text>
                  <Text style={[basicStyles.heading]}>{likedDished}</Text>
                </View>
                <View
                  style={[
                    basicStyles.paddingHorizontal,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={[basicStyles.text, basicStyles.grayColor]}>
                    Comments
                  </Text>
                  <Text style={[basicStyles.heading]}>{likedDished}</Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.handleOrderHistory}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.optionList,
                ]}>
                <Image
                  source={ic_order_history}
                  resizeMode="cover"
                  style={styles.paymentOptionIcon}
                />
                <Text style={[basicStyles.text, basicStyles.flexOne]}>
                  Order History
                </Text>
                <Image
                  source={ic_right}
                  resizeMode="cover"
                  style={styles.nextIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleAddressBook}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.optionList,
                ]}>
                <Image
                  source={ic_address_book}
                  resizeMode="cover"
                  style={styles.paymentOptionIcon}
                />
                <Text style={[basicStyles.text, basicStyles.flexOne]}>
                  Address Book
                </Text>
                <Image
                  source={ic_right}
                  resizeMode="cover"
                  style={styles.nextIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleFavOrder}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.optionList,
                ]}>
                <Image
                  source={ic_fav_order}
                  resizeMode="cover"
                  style={styles.paymentOptionIcon}
                />
                <Text style={[basicStyles.text, basicStyles.flexOne]}>
                  Favorite Orders
                </Text>
                <Image
                  source={ic_right}
                  resizeMode="cover"
                  style={styles.nextIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleContact}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.optionList,
                ]}>
                <Image
                  source={ic_contact}
                  resizeMode="cover"
                  style={styles.paymentOptionIcon}
                />
                <Text style={[basicStyles.text, basicStyles.flexOne]}>
                  Contact Us
                </Text>
                <Image
                  source={ic_right}
                  resizeMode="cover"
                  style={styles.nextIcon}
                />
              </TouchableOpacity>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyCenter,
                  basicStyles.marginTop,
                  basicStyles.alignCenter,
                ]}>
                <TouchableOpacity onPress={this.handleLogout}>
                  <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* <BottomModal
          visible={this.state.editProfilePopup}
          onTouchOutside={() => this.setState({editProfilePopup: false})}>
          <ModalContent
            style={{
              minHeight: hp(30),
            }}>
            <View style={styles.popupContainer}>
              <ScrollView>
                <View>
                  <Text>Name</Text>
                  <TextInput
                    placeholder={name}
                    placeholderTextColor="#333"
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={e => this.setState({name: e})}
                  />
                </View>

                <View>
                  <Text>Bio</Text>
                  <TextInput
                    placeholder="Enter Bio"
                    multiline
                    placeholderTextColor="#333"
                    style={styles.inputBig}
                    value={this.state.bio}
                    onChangeText={e => this.setState({bio: e})}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleUpdateProfile}>
                  <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ModalContent>
        </BottomModal> */}

        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          closeOnPressMask={false}
          onClose={this.closePopup}
          // height={hp(60)}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            container: {
              minHeight: hp(50),
              padding: wp(2),
              borderTopLeftRadius: wp(4),
              borderTopRightRadius: wp(4),
            },
            draggableIcon: {
              backgroundColor: '#ff6000',
            },
          }}>
          <TouchableWithoutFeedback style={styles.popupContainer}>
            <ScrollView contentContainerStyle={[styles.popupContainerInner]}>
              <View>
                <Text>Name</Text>
                <TextInput
                  placeholder={name}
                  placeholderTextColor="#333"
                  style={styles.input}
                  value={this.state.name}
                  onChangeText={e => this.setState({name: e})}
                />
              </View>

              <View>
                <Text>Bio</Text>
                <TextInput
                  placeholder="Enter Bio"
                  multiline
                  placeholderTextColor="#333"
                  style={styles.inputBig}
                  value={this.state.bio}
                  onChangeText={e => this.setState({bio: e})}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleUpdateProfile}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </RBSheet>

        {changePasswordPopup && (
          <ChangePasswordPopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
        )}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  paymentList: {
    padding: wp(3),
    margin: wp(2),
    marginBottom: wp(0),
  },
  dot: {
    backgroundColor: '#333',
    height: 5,
    width: 5,
    borderRadius: 2.5,
    marginHorizontal: wp(2),
  },
  userImageGradient: {
    height: hp(15.7),
    borderRadius: wp(19),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileView: {
    marginTop: wp(1),
    // height: hp(16),
    borderRadius: hp(8.5),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc4',
  },
  userImage: {
    height: hp(15),
    borderRadius: hp(7.8),
    aspectRatio: 1 / 1,
  },
  profileContainer: {
    paddingBottom: wp(5),
    paddingTop: wp(3),
    alignItems: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  icon: {
    width: wp(3),
    aspectRatio: 1 / 1,
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  optionList: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(3),
    // borderWidth: 1,
    // borderColor: '#cccccc80',
    backgroundColor: '#fff',
    marginBottom: wp(2),
    borderRadius: 4,
  },
  paymentOptionIcon: {
    width: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  nextIcon: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginRight: wp(0),
    opacity: 0.2,
  },
  buttonContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: wp(4),
    paddingTop: wp(4),
  },
  editProfileButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: wp(4),
  },

  popupContainer: {
    // width: wp(100),
    // backgroundColor: 'white',
    // padding: wp(5),
    // borderTopLeftRadius: wp(5),
    // borderTopRightRadius: wp(5),
  },

  profileViews: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(14),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },

  userImages: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(12.5),
  },
  editIconCircle: {
    backgroundColor: '#F57C00',
    height: wp(8),
    aspectRatio: 1 / 1,
    position: 'absolute',
    borderRadius: wp(20),
    bottom: wp(-2),
    right: wp(-1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: wp(4.5),
    aspectRatio: 1 / 1,
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(5.5),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    backgroundColor: '#ccc4',
  },
  inputBig: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(10),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    textAlignVertical: 'top',
    backgroundColor: '#ccc4',
  },
  button: {
    backgroundColor: '#F57C00',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  logoutButton: {
    fontSize: wp(3.8),
    color: '#999',
    textDecorationLine: 'underline',
  },
});
