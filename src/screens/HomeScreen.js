import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  AppState,
  Platform,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

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
import FooterComponent from '../components/FooterComponent';

// Images
import logo_black from '../assets/images/logo_black.png';

// Icons
import ic_cart_black from '../assets/icons/ic_cart_black.png';
import map_orange from '../assets/icons/map_orange.png';

// Tabs
import NewsFeedsTab from './CustomerHomeTabs/NewsFeedsTab';
import LiveTab from './CustomerHomeTabs/LiveTab';
import VendorsTab from './CustomerHomeTabs/VendorsTab';
import FarmFreshTab from './CustomerHomeTabs/FarmFreshTab';

// Components
import Stories from './Stories';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';
// import uploadToken from '../firebase_api/UploadTokenAPI';

// UserPreference
import {KEYS, storeData, getData} from 'state/utils/UserPreference';

// Firebase Delegates
import {
  checkPermission,
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from '../firebase_api/FirebaseAPI';

// References
export let homeScreenFetchNotificationCount = null;

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {homeSelectors, homeOperations} from 'state/ducks/home';
import {cartSelectors, cartOperations} from 'state/ducks/cart';
import {
  cartCountSelectors,
  cartCountOperations,
} from 'state/ducks/cartItemCount';
import {postsSelectors, postsOperations} from 'state/ducks/posts';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liveStories: null,
      tabActive: 'Feed',
      preActiveTab: 'Feed',
      notificationCount: 0,
      currentLocation: 'Select Location.',
      activeTabsArray: [],
      appState: AppState.currentState,
    };
  }

  handleCart = () => {
    this.props.navigation.navigate('Cart');
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchCurrentLocation();
    await checkPermission();
    this.fetchCartCount();
    this.fetchNotificationCount();
    this.fetchStories();

    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      this.props.navigation.navigate('Notification');
      return;
    }

    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  backAction = () => {
    const {activeTabsArray} = this.state;

    let preActiveTab = activeTabsArray.pop();

    if (this.state.tabActive === 'Feed') {
      Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    } else {
      this.setState({tabActive: preActiveTab});
      return true;
    }
  };

  handleAppStateChange = async nextAppState => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.fetchNotificationCount();
      }

      this.setState({appState: nextAppState});
    } catch (error) {
      console.log(error.message);
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  fetchNotificationCount = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {payloadId} = userInfo;

        // preparing params
        const params = {
          payloadId,
        };
        // calling api

        await this.props.getNotificationCount(
          'Notifications/getNotificationCount',
          params,
          true,
        );

        const {isGetNotificationCount: response} = this.props;

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {notificationCount} = response;
            console.log('Notification Count', notificationCount);
            this.setState({
              notificationCount,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchCartCount = async () => {
    try {
      // starting loader
      // this.setState({isLoading: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
      };

      // calling api
      await this.props.getCartCount('Customers/cartCount', params);

      const {isGetCartCount: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {cartCount: cartItemCount} = response;
          this.props.saveCartCount(cartItemCount);
          // // await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});

          this.setState({
            cartItemCount,
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

  fetchStories = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        return;
      }
      // starting loader
      this.setState({isLoading: true});

      await this.props.liveStories('Customers/liveStories', null, true, true);

      const {isLiveStories: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {liveStories} = response;

          this.setState({
            liveStories,
            status: null,
            isLoading: false,
          });
        } else {
          const {message, isAuthTokenExpired} = response;

          this.setState({
            status: message,
            liveStories: null,
            isLoading: false,
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
          }
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

  handleStoryReaction = async (postId, reactions, isPoll) => {
    // Checking Login

    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true, contentLoading: true});

      const params = {
        postId,
        reactions,
        isPoll,
      };

      await this.props.addReaction('Customers/addReaction', params, true);

      const {isAddReaction: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        this.setState({
          contentLoading: false,
          isProcessing: false,
        });

        if (success) {
          const {message} = response;

          showToast(message);
          await this.fetchStories();
        } else {
          const {message, isAuthTokenExpired} = response;

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

  handlePostComment = async (comment, postId) => {
    // Checking Login

    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    // validations
    if (comment.trim() === '') {
      Alert.alert('Reply!', 'Message cannot be blank!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true, contentLoading: true});

      const params = {
        postId,
        comment,
      };

      await this.props.commentPost('Customers/commentPost', params, true);

      const {isCommentPost: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        this.setState({
          contentLoading: false,
          isProcessing: false,
        });

        if (success) {
          const {message} = response;

          showToast(message);
          await this.fetchStories();
        } else {
          const {message, isAuthTokenExpired} = response;

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

  handleReportStory = async (postId, is_block, reason) => {
    // Checking Login

    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true, contentLoading: true});

      const params = {
        postId,
        is_report: 'Y',
        is_block: is_block === true ? 'Y' : 'N',
        reasion: reason,
      };

      await this.props.reportOrBlock('Customers/reportOrBlock', params, true);

      const {isReportOrBlock: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        this.setState({
          contentLoading: false,
          isProcessing: false,
        });
        await this.fetchStories();
        if (success) {
          const {message} = response;

          showToast(message);
        } else {
          const {message, isAuthTokenExpired} = response;

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

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Feed') {
      return (
        <NewsFeedsTab
          navigation={this.props.navigation}
          fetchStories={this.fetchStories}
        />
      );
    } else if (tabActive === 'Live') {
      return (
        <LiveTab
          navigation={this.props.navigation}
          fetchStories={this.fetchStories}
        />
      );
    } else if (tabActive === 'Vendor') {
      return (
        <VendorsTab
          navigation={this.props.navigation}
          fetchStories={this.fetchStories}
        />
      );
    } else if (tabActive === 'Farm') {
      return (
        <FarmFreshTab
          navigation={this.props.navigation}
          fetchStories={this.fetchStories}
        />
      );
    }
  };

  handleFeed = async () => {
    let {tabActive, activeTabsArray} = this.state;
    activeTabsArray.push(tabActive);

    await this.setState({preActiveTab: tabActive, activeTabsArray});

    this.setState({tabActive: 'Feed'});
  };

  handleLive = async () => {
    let {tabActive, activeTabsArray} = this.state;
    activeTabsArray.push(tabActive);

    await this.setState({preActiveTab: tabActive, activeTabsArray});

    this.setState({tabActive: 'Live'});
  };
  handleVendor = async () => {
    let {tabActive, activeTabsArray} = this.state;
    activeTabsArray.push(tabActive);

    await this.setState({preActiveTab: tabActive, activeTabsArray});

    this.setState({tabActive: 'Vendor'});
  };
  handleFarm = async () => {
    let {tabActive, activeTabsArray} = this.state;
    activeTabsArray.push(tabActive);

    await this.setState({preActiveTab: tabActive, activeTabsArray});

    this.setState({tabActive: 'Farm'});
  };

  fetchCurrentLocation = async () => {
    try {
      const formatted_address = await getData(KEYS.CURRENT_LOCATION);

      if (formatted_address) {
        this.setState({currentLocation: formatted_address});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  selectAddressCallback = async formatted_address => {
    await this.setState({
      currentLocation: formatted_address,
      // tabActive: 'Live',
    });

    if (this.state.tabActive === 'Feed') {
      await this.setState({tabActive: 'Live'});
      await this.setState({tabActive: 'Feed'});
    } else {
      await this.setState({tabActive: 'Feed'});
    }
  };

  handleCurrentLoc = async () => {
    // }
    const navParams = {selectAddressCallback: this.selectAddressCallback};
    this.props.navigation.navigate('CurrentLocation', navParams);
  };

  onLoginPress = () => {
    this.props.navigation.navigate('Register');
  };

  render() {
    const {
      liveStories,
      tabActive,
      currentLocation,
      isProcessing,
      notificationCount,
    } = this.state;

    const activeStyle = [styles.tabBarIndicator, {backgroundColor: '#f57c00'}];
    const tabActiveText = [styles.tabBarLabel, {color: '#333'}];
    const numLines = 1;
    return (
      <SafeAreaView style={[styles.container]}>
        <View style={[basicStyles.mainContainer]}>
          <HeaderComponent
            showHeaderLogo
            nav={this.props.navigation}
            showCartIcon
            showAccountIcon
            showNotification
            notificationCount={notificationCount}
          />

          {/*   <TouchableOpacity
            onPress={this.handleCurrentLoc}
            style={[
              basicStyles.directionRow,
              basicStyles.paddingHalfHorizontal,
            ]}>
            <Image
              source={map_orange}
              resizeMode="cover"
              style={styles.mapIcon}
            />
            <View style={styles.dashed}>
              <Text style={styles.addressText}>
                {currentLocation.length < 35
                  ? `${currentLocation}`
                  : `${currentLocation.substring(0, 40)}...`}
              </Text>
            </View>
          </TouchableOpacity>

          {liveStories ? (
            <Stories
              liveStories={liveStories}
              handlePostComment={this.handlePostComment}
              handleReportStory={this.handleReportStory}
              handleStoryReaction={this.handleStoryReaction}
            />
          ) : null} */}

          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={this.handleFeed} style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Feed' ? tabActiveText : styles.tabBarLabel
                }>
                {' '}
                Feed{' '}
              </Text>
              <View
                style={
                  tabActive === 'Feed' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleLive} style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Live' ? tabActiveText : styles.tabBarLabel
                }>
                {' '}
                Live Now{' '}
              </Text>
              <View
                style={
                  tabActive === 'Live' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleVendor}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Vendor' ? tabActiveText : styles.tabBarLabel
                }>
                {' '}
                Food Fresh{' '}
              </Text>
              <View
                style={
                  tabActive === 'Vendor' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleFarm} style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Farm' ? tabActiveText : styles.tabBarLabel
                }>
                {' '}
                Farm Fresh{' '}
              </Text>
              <View
                style={
                  tabActive === 'Farm' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>
          </View>

          {this.renderSlots()}
        </View>
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isGetNotificationCount: homeSelectors.isGetNotificationCount(state),
  isGetCartCount: cartSelectors.isGetCartCount(state),
  isLiveStories: postsSelectors.isLiveStories(state),
  isAddReaction: postsSelectors.isAddReaction(state),
  isCommentPost: postsSelectors.isCommentPost(state),
  isReportOrBlock: postsSelectors.isReportOrBlock(state),
  getCartItemCount: cartCountSelectors.getCartItemCount(state),
});

const mapDispatchToProps = {
  getNotificationCount: homeOperations.getNotificationCount,
  saveCartCount: cartCountOperations.saveCartCount,
  getCartCount: cartOperations.getCartCount,
  liveStories: postsOperations.liveStories,
  addReaction: postsOperations.addReaction,
  commentPost: postsOperations.commentPost,
  reportOrBlock: postsOperations.reportOrBlock,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabStyle: {
    // flex: 1,
    alignItems: 'center',
    // height: '100%',
    justifyContent: 'center',
    zIndex: 7,
  },
  tabBarStyle: {
    // marginBottom: hp(2),
    backgroundColor: '#fff',
    padding: 0,
    elevation: 0,
    justifyContent: 'space-around',
  },
  tabBarLabel: {
    color: '#bebebe',
    fontSize: wp(4.5),
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    marginBottom: hp(-1.8),
    textAlignVertical: 'center',
  },

  tabBarIndicator: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 5,
    height: 5,
    // alignSelf: 'center',
    borderRadius: 2.5,
    // marginLeft: wp(12.2),
  },
  mapIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
  addressText: {
    fontSize: wp(3.4),
    color: '#666',
  },
  dashed: {
    borderBottomWidth: 1,
    // borderRadius: 1,
    borderStyle: 'dashed',
    borderBottomColor: '#999',
    backgroundColor: '#FFFFFF',
    alignContent: 'flex-start',
    // borderTopColor: '#fff',
    // borderLeftColor: '#fff',
    // borderRightColor: '#fff',
    borderTopWidth: 0,
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 0,
    flexDirection: 'row',
    height: hp(5),
    // alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: hp(1),
  },
});
