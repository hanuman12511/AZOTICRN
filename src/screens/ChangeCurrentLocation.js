import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Libraries
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

// Components
import HeaderComponent from '../components/HeaderComponent';

import {showToast} from '../components/CustomToast';
import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';

import basicStyles from '../styles/BasicStyles';
// Icons
// import ic_add from 'assets/icons/ic_add.png';

//  map Functionality
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');
// navigator.geolocation = require('react-native-geolocation-service');

// API
// import {BASE_URL, makeNetworkRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData, storeData} from 'state/utils/UserPreference';

import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class ChangeCurrentLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      myAddress: null,
      status: null,
      isProcessing: false,
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

  fetchLocationDetail = async (data, details) => {
    try {
      if (!details) {
        return;
      }
      this.setState({isProcessing: true});

      const {geometry} = details;
      const {location} = geometry;

      const {lat, lng} = location;

      const {getParam, pop} = this.props.navigation;
      const callback = getParam('selectAddressCallback', null);
      const {formatted_address} = details;
      const locationCoords = {latitude: lat, longitude: lng};

      await this.handleSaveLocation(locationCoords);

      await storeData(KEYS.CURRENT_LOCATION, formatted_address);
      await storeData(KEYS.LOCATION_COORDS, locationCoords);

      this.setState({
        isProcessing: false,
      });

      if (callback) {
        await callback(formatted_address);
        pop();
      }
      //   }
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSaveLocation = async locationCoords => {
    const {latitude, longitude} = locationCoords;

    try {
      // starting loader
      // this.setState({isProcessing: true});

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
      const response = await makeNetworkRequest(
        'Customers/saveUserLatLong',
        params,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        // this.setState({
        //   isProcessing: false,
        // });

        if (success) {
          showToast(message);
        } else {
          showToast(message);
        }
      } else {
        // this.setState({
        //   isProcessing: false,
        //   isLoading: false,
        // });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isProcessing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Set Delivery Location"
          nav={this.props.navigation}
          navAction="back"
        />
        <ScrollView keyboardShouldPersistTaps="always">
          <GooglePlacesAutocomplete
            placeholder="Search for area, street name..."
            onPress={(data, details) => this.fetchLocationDetail(data, details)}
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
                marginHorizontal: wp(1),
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
        </ScrollView>

        {/* 
        <ScrollView keyboardShouldPersistTaps="always">
          <GooglePlacesAutocomplete
            placeholder="Search for area, street name..."
            onPress={(data, details) => {
              console.log('Helllo');
            }}
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
                marginHorizontal: wp(1),
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
        </ScrollView> */}

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
    paddingTop: wp(2),
  },
  separator: {
    height: wp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(1),
  },
  alignItems: {
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: '700',
  },
  text: {
    fontSize: wp(3),
  },
  color: {
    color: '#2bb256',
  },
  icon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    marginLeft: wp(3),
  },
  listContainer: {
    padding: wp(2),
  },
  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
