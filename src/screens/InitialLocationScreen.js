import React, {Component} from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Platform,
  DeviceEventEmitter,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ImageSlider from 'react-native-image-slider';

// Libraries
import SafeAreaView from 'react-native-safe-area-view';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

// styles
import basicStyles from '../styles/BasicStyles';
import ProcessingLoader from '../components/ProcessingLoader';

import ic_gps from '../assets/icons/ic_gps.png';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {showToast} from '../components/CustomToast';

import APP_Banner1 from '../assets/images/APP_Banner1.jpg';
import APP_Banner2 from '../assets/images/APP_Banner2.jpg';
import APP_Banner3 from '../assets/images/APP_Banner3.gif';
import {getData, KEYS, storeData} from 'state/utils/UserPreference';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {homeOperations, homeSelectors} from 'state/ducks/home';

class InitialLocationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,
    };
  }

  componentDidMount() {
    // this.checkPermission();
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
              this.handleLocationEnabled();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleLocationEnabled();
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

  handleLocationEnabled = () => {
    if (Platform.OS === 'android') {
      console.log('Android');
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>App wants to use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: 'Change',
        cancel: 'NO, Thanks',
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true, // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
      })
        .then(this.fetchCurrentPosition)
        .catch(error => {
          const {message} = error;

          if (message === 'disabled') {
            // this.props.navigation.navigate('SelectLocation');
            Alert.alert(
              'Location Alert!',
              'You have to enable location & provide location permission to use this app.\t Press OK to provide location.',
              [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: this.checkPermission},
              ],
            );
          }
        });

      DeviceEventEmitter.addListener(
        'locationProviderStatusChange',
        function (status) {
          // only trigger when "providerListener" is enabled
          console.log('Status', status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        },
      );
    } else if (Platform.OS === 'ios') {
      console.log('IOS');
      this.fetchCurrentPosition();
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

          console.log(results);

          // filtering addresses result(taking first address only)
          const filteredResult = results[5];
          const currentLocationAddress = filteredResult.formatted_address;

          const locationCoords = {latitude, longitude};

          await this.handleSaveLocation(locationCoords);

          await storeData(KEYS.CURRENT_LOCATION, currentLocationAddress);

          await storeData(KEYS.LOCATION_COORDS, locationCoords);

          const userInfo = await getData(KEYS.USER_INFO);

          this.setState({
            isProcessing: false,
            locationPopUp: false,
          });

          if (userInfo) {
            this.props.navigation.navigate('LoggedIn');
          } else {
            this.props.navigation.navigate('LoggedOut');
          }
        } else {
          const {error_message} = response;
          console.log(error_message);

          this.setState({
            formatted_address: '',
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

  handleSaveLocation = async locationCoords => {
    const {latitude, longitude} = locationCoords;

    try {
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
        latitude,
        longitude,
      };

      // calling api
      await this.props.saveUserLatLong('Customers/saveUserLatLong', params);

      const {isSaveUserLatLong: response} = this.props;

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          showToast(message);
        } else {
          showToast(message);
        }
      } else {
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <View style={[basicStyles.container]}>
        <View style={styles.mainContainer}>
          {/* <Text style={styles.signText}>Welcome To Agzotic</Text> */}

          <View style={{height: hp(75)}}>
            <ImageSlider
              images={[APP_Banner1, APP_Banner3]}
              // autoPlayWithInterval={1000}
              // style={{height: hp(40)}}
            />
          </View>

          <Text style={styles.messageStyle}>
            Let us fetch your current location to serve you better.
          </Text>

          <TouchableOpacity
            underlayColor="#F57C0080"
            style={[basicStyles.orangeBgColor, styles.button]}
            onPress={this.checkPermission}>
            <Text
              style={[
                basicStyles.text,
                basicStyles.textBold,
                basicStyles.whiteColor,
              ]}>
              Use My Location
            </Text>
            <Image
              source={ic_gps}
              resizeMode="cover"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          {/* <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              {alignSelf: 'center'},
            ]}>
            <Text> Have An Account ? </Text>
            <TouchableOpacity
              underlayColor="#F57C0080"
              onPress={this.handleHome}>
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.textBold,
                  basicStyles.orangeColor,
                ]}>
                Login
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        {this.state.isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isSaveUserLatLong: homeSelectors.isSaveUserLatLong(state),
});

const mapDispatchToProps = {
  saveUserLatLong: homeOperations.saveUserLatLong,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitialLocationScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageStyle: {
    alignSelf: 'center',
    fontSize: wp(4.6),
    fontWeight: '700',
    color: '#F57C00',
    textAlign: 'center',
    width: wp(70),
    marginTop: hp(4),
  },
  input: {
    fontSize: wp(4),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    height: hp(5.5),
    backgroundColor: '#f2f1f1',
    marginBottom: wp(3),
  },
  arrowIcon: {
    width: wp(6),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  button: {
    borderRadius: wp(1),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(3),
    flexDirection: 'row',
    marginHorizontal: wp(12),
  },

  orSecretor: {
    marginTop: hp(1),
    marginBottom: hp(5),
  },

  button3: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signText: {
    fontSize: wp(6.5),
    fontWeight: '700',
    color: '#333',
    marginVertical: wp(2),
    paddingLeft: wp(4),
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
