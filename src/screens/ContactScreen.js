import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

// Images
import map from '../assets/images/map.png';
import ic_phone_orange from '../assets/icons/ic_contact.png';
import ic_chat_orange from '../assets/icons/ic_chat_orange.png';
import ic_mail_oeange from '../assets/icons/ic_mail_oeange.png';
import ic_map_orange from '../assets/icons/ic_map_orange.png';

// API

import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchContactDetails();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchContactDetails = async () => {
    try {
      // calling api
      const response = await makeNetworkRequest('Customers/contactUs');

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {contactInfo} = response;

          const {mobile_number, whats_app_number, email, address} = contactInfo;

          this.setState({
            mobile_number,
            whats_app_number,
            email,
            address,
            isLoading: false,
          });
        } else {
          this.setState({
            isLoading: false,
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

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {mobile_number, whats_app_number, email, address} = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          navAction="back"
          headerTitle="Contact Us"
          nav={this.props.navigation}
        />
        <View style={[basicStyles.mainContainer, basicStyles.padding]}>
          {/* <View style={basicStyles.directionRow}>
            <Image source={map} resizeMode="cover" style={styles.mapImage} />
          </View> */}

          <Text style={styles.heading}>We are always here to assist you.</Text>

          <View style={styles.addressInfoList}>
            <Image
              source={ic_phone_orange}
              resizeMode="cover"
              style={styles.iconRow}
            />
            <View>
              <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                Call us at
              </Text>
              <Text style={basicStyles.headingLarge}>{mobile_number}</Text>
            </View>
          </View>
          <View style={styles.addressInfoList}>
            <Image
              source={ic_chat_orange}
              resizeMode="cover"
              style={styles.iconRow}
            />

            <View>
              <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                Chat with us at
              </Text>
              <Text style={basicStyles.headingLarge}>{whats_app_number}</Text>
            </View>
          </View>
          <View style={styles.addressInfoList}>
            <Image
              source={ic_mail_oeange}
              resizeMode="cover"
              style={styles.iconRow}
            />
            <View>
              <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                Email us at
              </Text>
              <Text style={basicStyles.headingLarge}>{email}</Text>
            </View>
          </View>
          <View style={styles.addressInfoList}>
            <Image
              source={ic_map_orange}
              resizeMode="cover"
              style={styles.iconRow}
            />
            <View>
              <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                Find us at
              </Text>

              <View style={basicStyles.directionRow}>
                <Image
                  source={map}
                  resizeMode="cover"
                  style={styles.mapImage}
                />
              </View>

              <TouchableOpacity style={styles.viewMap}>
                <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                  View location in map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mapImage: {
    width: wp(75),
    aspectRatio: 2 / 1,
    borderRadius: 10,
  },
  heading: {
    fontSize: wp(8),
    fontWeight: '700',
    marginTop: wp(4),
    marginBottom: wp(1),
  },
  addressInfoList: {
    backgroundColor: '#f2f1f190',
    marginTop: wp(2),
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: wp(2),
    borderRadius: 3,
  },
  iconRow: {
    width: hp(2.4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  viewMap: {
    borderWidth: 1,
    borderColor: '#f57d02',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: wp(3),
  },
});
