import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Components
import FavoriteOrderComponet from '../components/FavoriteOrderComponet';
import HeaderComponent from '../components/HeaderComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images

//UserPreference
import {clearData, KEYS} from 'state/utils/UserPreference';

// API

import {FacebookLoader} from 'react-native-easy-content-loader';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class FavoriteOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveProducts: null,
      contentLoading: true,
      isProcessing: false,
      isLoading: false,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchViewOrders();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchViewOrders = async () => {
    try {
      // Preparing Params
      const params = null;

      // calling api
      const response = await makeNetworkRequest(
        'Customers/favouriteProducts',
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

        const {success, message} = response;

        if (success) {
          const {liveProducts} = response;

          this.setState({
            liveProducts,
            status: null,
            contentLoading: false,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {isAuthTokenExpired} = response;
          this.setState({
            status: message,
            liveProducts: null,
            contentLoading: false,
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
          contentLoading: false,
          isLoading: false,
          isListRefreshing: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAddToFavs = async (productId, favStatus) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        productId,
        status: false,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/addToFavourite',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});
        if (success) {
          await this.fetchViewOrders();
          showToast(message);
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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };

  renderItem = ({item}) => (
    <FavoriteOrderComponet
      item={item}
      nav={this.props.navigation}
      handleAddToFavs={this.handleAddToFavs}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

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

  handleSort = () => {};
  handleFilter = () => {};

  render() {
    const {contentLoading, liveProducts} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <HeaderComponent
          navAction="back"
          // showHeaderLogo
          showAccountIcon
          showCartIcon
          nav={this.props.navigation}
          headerTitle="Favorite Orders"
        />

        {contentLoading === true ? (
          <View>
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
          </View>
        ) : (
          <View style={basicStyles.flexOne}>
            {liveProducts ? (
              <View style={styles.flatContainer}>
                <FlatList
                  data={liveProducts}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              </View>
            ) : (
              <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                <Text style={basicStyles.noDataTextStyle}>
                  No Favorite Order.
                </Text>
              </View>
            )}
          </View>
        )}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sortIcon: {
    backgroundColor: '#31895120',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  orderNow: {
    paddingVertical: wp(2),
    borderTopWidth: 1,
    borderTopColor: '#ccc4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    marginHorizontal: wp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#cccccc80',
  },

  filterIcon: {
    backgroundColor: '#853a7120',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
  },

  flatContainer: {
    flex: 1,
    // // marginHorizontal: wp(2),
    // backgroundColor: 'rgba( 0, 0, 0, 0.9 )',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // elevation: 5,
  },
  topOptionImg: {
    height: wp(15),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    marginVertical: hp(0.5),
  },
  screenInfo: {
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp(20),
    marginHorizontal: wp(1),
  },
  screenInfoTitle: {
    color: '#333',
    fontSize: wp(3),
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: wp(3.2),
    textAlign: 'center',
    color: '#fff',
  },
  filterButton: {
    marginVertical: hp(2),
    backgroundColor: '#333',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: {
    height: wp(2),
  },
  listContainer: {
    marginTop: 4,
  },
  imageStyle: {
    width: wp(30),
    aspectRatio: 1 / 1,
    borderRadius: 10,
    borderWidth: 2,
  },
  vImage: {
    width: wp(8),
    aspectRatio: 1 / 1,
    borderRadius: wp(4),
    marginRight: wp(2),
  },
  textStyle: {
    fontSize: wp(4.5),
    color: '#333',
    fontWeight: '700',
  },
  trackImage: {
    width: wp(100),
    aspectRatio: 1 / 1.27,
  },
  noDataStyle: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: wp(4),
  },
});
