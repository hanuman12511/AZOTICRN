import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import CheckBox from '@react-native-community/checkbox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';
import basicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';

// Images
import map from '../assets/images/map.png';

// Icons
import ic_drawer_address from '../assets/icons/map_orange.png';
import ic_location from '../assets/icons/ic_location.png';

//  map Functionality
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData, clearData} from 'state/utils/UserPreference';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class AddAddressScreen extends Component {
  constructor(props) {
    super(props);

    const newAddress = props.navigation.getParam('newAddress', null);

    if (newAddress) {
      var {formatted_address, name, lat: latitude, lng: longitude} = newAddress;
    }

    this.state = {
      formatted_address: formatted_address ? formatted_address : '',
      locationName: name ? name : 'Location Name',
      isProcessing: false,
      currentLocationAddress: null,
      name: '',
      flatNo: '',
      address: formatted_address,
      isDefaultAddress: false,
      nickName: '',
      showOtherNickName: false,
      landMark: '',
      buttonText: 'Select Location',
      locationPopUp: false,
    };

    // current location coordinates
    this.coords = {latitude, longitude};
    this.isLocationPermissionBlocked = false;
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.checkPermission();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          // this.isLocationPermissionBlocked = true;
          Alert.alert(
            'Location Services Not Available',
            'Press OK, then check and enable the Location Services in your Privacy Settings',
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
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.fetchCurrentPosition();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.fetchCurrentPosition();
          break;
        case RESULTS.BLOCKED:
          // this.isLocationPermissionBlocked = true;
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

  fetchCurrentPosition = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      showLocationDialog: true,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(
      this.geolocationSuccessCallback,
      this.geolocationErrorCallback,
      options,
    );
  };

  geolocationSuccessCallback = async position => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing info
      const API_KEY = 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k';
      this.coords = position.coords;

      const {latitude, longitude} = this.coords;

      // calling api
      const response = await makeRequest(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      );

      // processing response
      if (response) {
        const {status} = response;

        if (status === 'OK') {
          const {results} = response;

          // filtering addresses result(taking first address only)
          const filteredResult = results[0];
          const currentLocationAddress = filteredResult.formatted_address;

          const filteredName = results[0].address_components;
          const locationName = filteredName[1].long_name;

          this.setState({
            formatted_address: currentLocationAddress,
            address: currentLocationAddress,
            locationName,
            isProcessing: false,
            locationPopUp: false,
          });
        } else {
          const {error_message} = response;
          console.log(error_message);

          this.setState({
            formatted_address: '',
            address: '',
            isProcessing: false,
            locationPopUp: false,
          });
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          locationPopUp: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  geolocationErrorCallback = error => {
    if (
      error.code === 2 &&
      error.message === 'No location provider available.'
    ) {
      this.setState({
        formatted_address: '',
        isProcessing: false,
        locationPopUp: false,
      });
      Alert.alert(
        '',
        "Make sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      console.log(error.code, error.message);
      this.setState({
        formatted_address: '',
        isProcessing: false,
        locationPopUp: false,
      });
      Alert.alert(
        'Error',
        "Something went wrong...\nMake sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    }
  };

  handleLandMarkChange = text => {
    this.setState({landMark: text});
  };

  handleAddressChange = address => {
    if (address.trim() === '') {
      this.setState({locationName: ''});
    }
    this.setState({
      address,
      formatted_address: address,
      // locationName: '',
    });
  };

  handleLocationName = name => {
    this.setState({
      locationName: name,
    });
  };

  handleSetDefaultAddress = () => {
    this.setState(prevState => ({
      isDefaultAddress: !prevState.isDefaultAddress,
    }));
  };

  handleAddressNickName = nickName => () => {
    this.setState({nickName, showOtherNickName: false});
  };

  handleAddressOtherNickname = () => {
    this.setState({nickName: '', showOtherNickName: true});
  };

  handleAddressOtherNicknameChange = nickName => {
    this.setState({nickName});
  };

  handleSaveAddress = async () => {
    const {address, landMark, isDefaultAddress, nickName} = this.state;

    // validations
    if (!this.coords) {
      Alert.alert(
        'Location!',
        'Please select current location',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (landMark.trim() === '') {
      Alert.alert('Alert!', 'Please enter landmark', [{text: 'OK'}], {
        cancelable: false,
      });
      this.setState({landMark: ''});
      return;
    }

    // if (flatNo.trim() === '') {
    //   Alert.alert('', 'Please enter flat/house/office no.', [{text: 'OK'}], {
    //     cancelable: false,
    //   });
    //   this.setState({flatNo: ''});
    //   return;
    // }

    if (address.trim() === '') {
      Alert.alert('Alert!', 'Please enter Complete Address', [{text: 'OK'}], {
        cancelable: false,
      });
      this.setState({address: ''});
      return;
    }

    // if (name.trim() === '') {
    //   Alert.alert('', 'Please enter your name', [{text: 'OK'}], {
    //     cancelable: false,
    //   });
    //   this.setState({name: ''});
    //   return;
    // }

    if (nickName.trim() === '') {
      Alert.alert('Alert!', 'Please Select Type of Address', [{text: 'OK'}], {
        cancelable: false,
      });
      this.setState({nickName: ''});
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        return;
      }

      const {latitude: lat, longitude: long} = this.coords;

      // preparing params
      const params = {
        lat,
        long,
        address: address,
        isDefaultAddress,
        nickName,
        landMark,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/addAddress',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});

        if (success) {
          const {navigation} = this.props;
          const refreshMyAddressCallback = navigation.getParam(
            'refreshMyAddressCallback',
            null,
          );

          showToast(message);
          await refreshMyAddressCallback();
          navigation.pop();
        } else {
          this.setState({isProcessing: false});
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
          showToast(message);
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

  fetchLocationDetail = async (data, details) => {
    try {
      if (!details) {
        return;
      }

      const {geometry} = details;
      const {location} = geometry;

      const {lat, lng} = location;

      const {formatted_address, name} = details;

      let newAddress = {formatted_address, name, lat, lng};

      this.coords = {latitude: lat, longitude: lng};

      this.setState({
        address: formatted_address,
        locationName: name,
        formatted_address,
        locationPopUp: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {
      isProcessing,
      buttonText,
      address,
      isDefaultAddress,
      nickName,
      showOtherNickName,
      formatted_address,
      locationName,
      landMark,
    } = this.state;

    const selectedNickNameStyle = {
      ...styles.btn,
      color: '#f57c00',
      borderColor: '#f57c00',
    };

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Address Detail"
          style={styles.container}
          nav={this.props.navigation}
          navAction="back"
        />

        <View style={basicStyles.directionRow}>
          <Image source={map} resizeMode="cover" style={styles.mapImage} />
        </View>

        <View style={basicStyles.flexOne}>
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.mainContainer}>
              <View style={styles.addAddressContainer}>
                <View style={styles.addressBar}>
                  <Image
                    source={ic_drawer_address}
                    resizeMode="cover"
                    style={styles.mapIcon}
                  />
                  <View
                    style={[
                      basicStyles.flexOne,
                      basicStyles.marginHorizontal,
                      {marginTop: wp(-2)},
                    ]}>
                    {/* <Text style={basicStyles.headingLarge}>{locationName}</Text> */}
                    <TextInput
                      style={styles.inputStyle}
                      placeholder="Location Name"
                      placeholderTextColor="#888"
                      value={locationName}
                      multiline={true}
                      onChangeText={this.handleLocationName}
                    />
                    {formatted_address.trim() !== '' ? (
                      <Text style={basicStyles.text}>{formatted_address}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({locationPopUp: true});
                    }}>
                    <Text style={styles.changeButton}>
                      {formatted_address ? 'Change' : buttonText}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Enter Complete Address"
                  placeholderTextColor="#888"
                  value={address}
                  onChangeText={this.handleAddressChange}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Landmark"
                  placeholderTextColor="#888"
                  value={landMark}
                  onChangeText={this.handleLandMarkChange}
                />

                <View
                  style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                  <CheckBox
                    style={styles.checkBoxStyle}
                    rightText="Set as default address"
                    value={isDefaultAddress}
                    onValueChange={this.handleSetDefaultAddress}
                    boxType="square"
                  />
                  <Text style={[basicStyles.text, basicStyles.grayColor]}>
                    Set As Default Address
                  </Text>
                </View>

                <Text style={styles.heading}>Save as</Text>
                <View style={styles.buttonRow}>
                  <Text
                    style={
                      nickName === 'Home' ? selectedNickNameStyle : styles.btn
                    }
                    onPress={this.handleAddressNickName('Home')}>
                    Home
                  </Text>
                  <Text
                    style={
                      nickName === 'Office' ? selectedNickNameStyle : styles.btn
                    }
                    onPress={this.handleAddressNickName('Office')}>
                    Office
                  </Text>
                  <Text
                    style={
                      showOtherNickName ? selectedNickNameStyle : styles.btn
                    }
                    onPress={this.handleAddressOtherNickname}>
                    Others
                  </Text>
                </View>

                {showOtherNickName && (
                  <TextInput
                    style={styles.input}
                    placeholder="Other Nick Name"
                    value={nickName}
                    onChangeText={this.handleAddressOtherNicknameChange}
                  />
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>

        <TouchableOpacity
          onPress={this.handleSaveAddress}
          // onPress={this.handleCheckout}
          underlayColor="transparent"
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save and Proceed</Text>
        </TouchableOpacity>

        <BottomModal
          visible={this.state.locationPopUp}
          onTouchOutside={() => this.setState({locationPopUp: false})}
          // modalStyle={{  }}
        >
          <ModalContent
            style={{
              // flex: 1,
              // backgroundColor: 'fff',
              minHeight: hp(70),
            }}>
            <TouchableOpacity
              onPress={this.fetchCurrentPosition}
              underlayColor="transparent"
              style={styles.addNewAddress}>
              <View style={styles.rows}>
                <Image
                  source={ic_location}
                  resizeMode="cover"
                  style={styles.icon}
                />
                <View>
                  <Text style={[styles.text, basicStyles.textBold]}>
                    Current Location
                  </Text>
                  <Text style={styles.text}>Using GPS</Text>
                </View>
              </View>
            </TouchableOpacity>

            <ScrollView keyboardShouldPersistTaps="always">
              <GooglePlacesAutocomplete
                placeholder="Search for area, street name..."
                onPress={(data, details) =>
                  this.fetchLocationDetail(data, details)
                }
                returnKeyType={'default'}
                fetchDetails={true}
                query={{
                  key: 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k',
                  language: 'en',
                  components: 'country:Ind',
                  fields: 'geometry',
                }}
                textInputProps={{
                  InputComp: TextInput,
                  leftIcon: {type: 'font-awesome', name: 'chevron-left'},
                  errorStyle: {color: 'red'},
                }}
                styles={{
                  container: {
                    flex: 1,
                    backgroundColor: '#fff',
                    marginTop: hp(2),
                  },
                  textInputContainer: {
                    // backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                    borderRadius: 5,
                    // elevation: 0.5,
                  },
                  textInput: {
                    height: hp(6),
                    color: '#777',
                    fontSize: wp(3.5),
                    fontWeight: '700',
                    backgroundColor: 'transparent',
                  },
                  predefinedPlacesDescription: {
                    color: '#333',
                  },
                }}
                onNotFound={() => console.log('Location Not Found')}
                isRowScrollable={true}
                currentLocation={true}
                currentLocationLabel="Use GPS to view nearby Locations"
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={false}
                GooglePlacesDetailsQuery={{
                  fields: ['formatted_address', 'geometry'],
                }}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  this.setState({locationPopUp: false});
                }}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Done
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </ModalContent>
        </BottomModal>
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: wp(3),
  },
  changeButton: {
    borderWidth: 1,
    borderColor: '#f57c00',
    paddingHorizontal: wp(4),
    paddingVertical: wp(1.5),
    color: '#f57c00',
  },
  mapImage: {
    width: wp(100),
    aspectRatio: 1 / 0.7,
  },
  addAddressContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: wp(3),
    borderTopLeftRadius: wp(3),

    padding: wp(3),
    paddingVertical: hp(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp(1),
  },
  mapIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    // marginTop: wp(3),
  },
  address: {
    flex: 1,
    backgroundColor: '#ededed',
    borderRadius: wp(2),
    padding: wp(1.6),
  },
  heading: {
    fontSize: wp(3.2),
    marginTop: wp(2),
  },
  description: {
    fontSize: wp(3),
  },
  currentLocationButton: {
    flexDirection: 'row',
    paddingVertical: hp(0.5),
    alignItems: 'center',
  },
  currentLocationButtonTitle: {
    color: '#444',
    fontSize: wp(3),
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    marginLeft: wp(2),
    padding: wp(0.6),
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#777',
    color: '#333',
    height: hp(5.5),
    borderRadius: 4,
    fontSize: wp(3),
    lineHeight: 12,
    marginRight: wp(3),
    marginBottom: hp(1),
  },
  inputStyle: {
    color: '#333',
    // height: hp(5),
    fontSize: wp(4.0),
    fontWeight: '700',
    paddingLeft: wp(-0.2),
    flex: 1,
    marginTop: wp(-1),
  },
  checkBoxStyle: {
    color: '#fff',
    height: hp(2),
    marginVertical: hp(2),
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.6),
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    color: '#444',
    fontSize: wp(3),
    marginRight: wp(2),
  },
  saveButton: {
    backgroundColor: '#f57c00',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp(4),
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
  },
  locationContainer: {
    backgroundColor: '#f57c00',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp(4),
    borderRadius: 5,
  },

  addNewAddress: {
    // backgroundColor: '#f65e83',
    // alignSelf: 'center',
    marginTop: wp(3),
    // marginBottom: hp(5),
  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(1),
  },
  icon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    // marginLeft: wp(3),
  },
  text: {
    fontSize: wp(3.5),
    // fontWeight: '700',
    color: '#F57C00',
  },
});
