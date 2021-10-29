import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import CustomLoader from '../components/CustomLoader';

// Icons
import ic_edit_profile from '../assets/icons/ic_edit_profile.png';
import ic_profile_black from '../assets/icons/ic_profile_black.png';
import ic_phone_black from '../assets/icons/ic_phone_black.png';
import ic_mail_black from '../assets/icons/ic_mail_black.png';
import ic_address_black from '../assets/icons/ic_address_black.png';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images

// UserPreference
import {clearData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      isLoading: true,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchUserProfile();
  }

  fetchUserProfile = async () => {
    try {
      // starting loader
      // this.setState({isLoading: true});

      // calling api
      let params = null;

      const response = await makeRequest(
        BASE_URL + 'Customers/viewProfile',
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
          const {userInfo} = response;

          this.setState({
            userInfo,
            isLoading: false,
            isListRefreshing: false,
          });
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
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          isListRefreshing: false,
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

  handleEditProfile = () => {
    const {userInfo} = this.state;
    this.props.navigation.push('EditProfile', {
      userInfo,
      refreshCallback: this.fetchUserProfile,
    });
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

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {userInfo} = this.state;
    const {name, mobile, email, image} = userInfo;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[styles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            navAction="back"
            headerTitle="Profile"
            nav={this.props.navigation}
          />
          <View style={styles.profileContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.profileContainer}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              <View style={styles.formContainer}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.profileHeader}>
                    <View style={styles.editIcon}>
                      <View
                        // onPress={this.handleEditProfile}
                        underlayColor="#f2f1f1">
                        <Image
                          source={ic_edit_profile}
                          style={styles.editIconImage}
                        />
                      </View>
                    </View>

                    {/* <View style={styles.nameFirstWord}> */}
                    {image !== null ? (
                      <Image
                        source={{uri: image}}
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
                    {/* </View> */}

                    <Text style={styles.userName}>{name}</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_profile_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>{name}</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_phone_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>{mobile}</Text>
                  </View>

                  <View style={styles.profileRow}>
                    <Image
                      source={ic_mail_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>{email}</Text>
                  </View>
                  <View style={styles.profileRow}>
                    <Image
                      source={ic_address_black}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>
                      A3 Mall Road Vidhyadhar Nagar
                    </Text>
                  </View>

                  {/* <TouchableOpacity
                  style={styles.profileRow}
                  onPress={this.handleLogout}>
                  <View style={styles.logoutRow}>
                    <Image
                      source={ic_profile_logout}
                      resizeMode="cover"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.userText}>Logout</Text>
                  </View>
                </TouchableOpacity> */}
                </KeyboardAvoidingView>
              </View>
            </ScrollView>
          </View>
        </View>
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
  nameFirstWord: {
    // backgroundColor: '#db9058',
    // width: wp(12),
    // height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: wp(5),
    color: '#fff',
  },
  paymentOptionIcon: {
    height: hp(13.5),
    aspectRatio: 1 / 1,
    borderRadius: hp(8),
  },
});
