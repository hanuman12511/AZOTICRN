import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';

import basicStyles from '../styles/BasicStyles';

//  map Functionality
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');

export default class SearchAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  fetchVendor = async (data, details) => {
    try {
      if (!details) {
        return;
      }

      const {geometry} = details;
      const {location} = geometry;

      const {lat, lng} = location;

      const {formatted_address, name} = details;

      let newAddress = {formatted_address, name, lat, lng};

      this.props.navigation.navigate('AddAddress', {
        newAddress,
        refreshMyAddressCallback: this.refreshMyAddressCallback,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  refreshMyAddressCallback = async () => {
    const refreshMyAddress = await this.props.navigation.getParam(
      'refreshMyAddress',
      null,
    );

    await refreshMyAddress();
    this.props.navigation.pop();
  };

  handleManualButton = () => {
    this.props.navigation.navigate('AddAddress', {
      refreshMyAddressCallback: this.refreshMyAddressCallback,
    });
  };

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Search Address"
          nav={this.props.navigation}
          navAction="back"
        />
        <View style={basicStyles.mainContainer}>
          {/* <View style={styles.input}>
            <Image
              source={ic_search_orange}
              resizeMode="cover"
              style={styles.locationIcon}
            />
            <TextInput
              placeholderTextColor="#ccc"
              placeholder="Enter Complete Address"
              style={styles.inputFelid}
            /> 
          </View> */}

          <ScrollView keyboardShouldPersistTaps="always">
            <GooglePlacesAutocomplete
              placeholder="Search for area, street name..."
              onPress={(data, details) => this.fetchVendor(data, details)}
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

          <TouchableOpacity
            style={styles.locationContainer}
            onPress={this.handleManualButton}>
            <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
              Enter Manually
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: hp(5.5),
    marginHorizontal: wp(4),
    marginBottom: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
  },
  inputFelid: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
  },
  locationContainer: {
    backgroundColor: '#ff9000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    marginBottom: wp(3),
    justifyContent: 'center',
    width: wp(95),
    alignSelf: 'center',
    borderRadius: wp(0.5),
  },
  locationIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
});
