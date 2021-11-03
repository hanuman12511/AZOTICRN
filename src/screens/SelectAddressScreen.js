import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import CustomLoader from '../components/CustomLoader';
import SelectAddressComponent from '../components/SelectAddressComponent';
import {showToast} from '../components/CustomToast';

// Icons
import ic_plus_orange from '../assets/icons/ic_plus_orange.png';
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, storeData, getData, clearData} from 'state/utils/UserPreference';

import ProcessingLoader from '../components/ProcessingLoader';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class SelectAddressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      addresses: [],
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchAddresses();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchAddresses = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);

      let params = null;
      // calling api
      const response = await makeNetworkRequest(
        'Customers/myAddress',
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
          const {addresses} = response;

          this.setState({
            addresses,
            status: null,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message, isAuthTokenExpired} = response;

          this.setState({
            addresses: null,
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });

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

  deleteAddressCallback = async addressId => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      // fetching userInfo

      // preparing params
      const params = {
        addressId,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/deleteAddress',
        params,
        true,
      );

      // processing response
      if (response) {
        // stopping loader
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          await this.fetchAddresses(message);
        } else {
          showToast(message);
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
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

  renderItem = ({item}) => (
    <SelectAddressComponent
      item={item}
      nav={this.props.navigation}
      handleCheckout={this.handleCheckout}
      deleteAddressCallback={this.deleteAddressCallback}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleSearchAddress = () => {
    this.props.navigation.navigate('SearchAddress', {
      refreshMyAddress: this.fetchAddresses,
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

  handleCheckout = async addressInfo => {
    let info = await this.props.navigation.getParam('info');

    info.addressInfo = addressInfo;

    this.props.navigation.navigate('Checkout', {info});
  };

  onLoginPress = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    const {addresses} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={[styles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            headerTitle="Select Address"
            nav={this.props.navigation}
            navAction="back"
            showAccountIcon
          />
          <View style={styles.mainContainer}>
            {addresses ? (
              <FlatList
                data={addresses}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : (
              <View style={basicStyles.noDataStyle}>
                <Text style={basicStyles.noDataTextStyle}>
                  No Address Found.
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={this.handleSearchAddress}
              style={styles.addNewAddress}>
              <View style={styles.row}>
                <Image
                  source={ic_plus_orange}
                  resizeMode="cover"
                  style={styles.icon}
                />
                <Text style={styles.text}>Add New Address</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#F57C00',
  },
  color: {
    color: '#2bb256',
  },
  icon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    // marginLeft: wp(3),
  },
  // listContainer: {
  //   padding: wp(2),
  // },
  addNewAddress: {
    // backgroundColor: '#f65e83',
    alignSelf: 'center',
    marginTop: wp(3),
    marginBottom: hp(5),
  },
  checkoutButton: {
    padding: wp(4),
  },
  checkoutButtonView: {
    backgroundColor: '#F57C00',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    borderRadius: 10,
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(4),
    color: '#fff',
    fontWeight: '700',
  },
});
