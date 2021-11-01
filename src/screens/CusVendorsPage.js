import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  BackHandler,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import VendorStories from './VendorStories';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import login_background from '../assets/images/login_background.png';
import vendoeBg from '../assets/images/vendoeBg.jpg';
import product from '../assets/images/product.jpg';
import checked_green from '../assets/icons/checked_green.png';

// Tabs
import GalleryTab from './CustomerHomeTabs/GalleryScreen';
import MenuTab from './CustomerHomeTabs/MenuScreen';

// UserPreference
import {KEYS, storeData, getData, clearData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class CusVendorsPage extends Component {
  constructor(props) {
    super(props);
    const item = props.navigation.getParam('item', null);
    this.item = item;
    const {vendorId, productId, activeStatus, initial, follow, vendorAddress} =
      item;

    this.state = {
      followStatus: follow,
      vendorAddress,
      vendorId,
      cartItemCount: 0,
      tabView: {
        index: initial,
        routes: [
          {key: 'Gallery', title: 'Gallery'},
          {key: 'Menu', title: 'Menu'},
        ],
      },

      liveStories: null,
    };

    // configuring TabView
    const window = Dimensions.get('window');
    const {width} = window;
    this.initialLayout = {width};

    // SceneMap routes
    const {navigation} = this.props;

    const GalleryRoute = () => (
      <GalleryTab
        navigation={navigation}
        handleTabChange={this.handleTabIndexChange}
        vendorId={vendorId}
        fetchCartCount={this.fetchCartCount}
      />
    );

    const MenuRoute = () => (
      <MenuTab
        navigation={navigation}
        handleTabChange={this.handleTabIndexChange}
        vendorId={vendorId}
        activeStatus={activeStatus}
        productId={productId}
        fetchCartItemCount={this.fetchCartItemCount}
      />
    );

    this.sceneMap = SceneMap({
      Gallery: GalleryRoute,
      Menu: MenuRoute,
    });
  }

  componentDidMount() {
    this.fetchCartItemCount();
    this.fetchStories();
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

  fetchStories = async () => {
    const {vendorId} = this.state;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        return;
      }

      // starting loader
      this.setState({isLoading: true});

      const params = {
        vendorId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/liveStories',
        params,
        true,
      );

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

  fetchCartItemCount = async msg => {
    try {
      const refreshCallback = await this.props.navigation.getParam(
        'refreshCallback',
        null,
      );

      refreshCallback();

      // starting loader
      this.setState({isLoading: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/cartCount',
        params,
      );

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {cartCount: cartItemCount} = response;
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

  handleTabIndexChange = index => {
    const tabView = {...this.state.tabView, index};
    this.setState({tabView});
  };

  onLoginPress = () => {
    this.props.navigation.navigate('Register');
  };

  handleFollowVendor = async () => {
    const {vendorId} = this.state;

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
      let {followStatus} = this.state;

      if (followStatus === true) {
        followStatus = false;
      } else if (followStatus === false) {
        followStatus = true;
      }
      // starting loader
      this.setState({isProcessing: true});
      const params = {
        vendorId,
        follow: followStatus,
      };
      console.log(params);
      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/followVendor',
        params,
        true,
      );
      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});

        if (success) {
          const {follow} = response;
          this.setState({followStatus: follow});
          const refreshCallback = await this.props.navigation.getParam(
            'refreshCallback',
            null,
          );

          refreshCallback();
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

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/addReaction',
        params,
        true,
      );

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

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/commentPost',
        params,
        true,
      );

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

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/reportOrBlock',
        params,
        true,
      );

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

  renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      labelStyle={styles.tabBarLabel}
      style={styles.tabBarStyle}
      activeColor={'#333'}
      inactiveColor="#999"
    />
  );

  render() {
    const {sceneMap, handleTabIndexChange, initialLayout} = this;
    const {tabView, cartItemCount, followStatus, liveStories} = this.state;

    const {
      vendorName,
      vendorImage,
      avgRatings,
      description,
      ratingCount,
      vendorAddress,
      followCount,
      likesCount,
    } = this.item;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Vendors"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
          showAccountIcon
          key={cartItemCount}
        />
        <View style={[basicStyles.flexOne, basicStyles.whiteBackgroundColor]}>
          <ParallaxScrollView
            parallaxHeaderHeight={355}
            backgroundColor="#fff"
            renderForeground={() => (
              <View
                style={{
                  height: hp(8),
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: hp(3),
                }}>
                <View style={[basicStyles.directionRow, styles.bgHeight]}>
                  <Image
                    source={vendoeBg}
                    resizeMode="cover"
                    style={styles.bgStyle}
                  />
                </View>

                <View
                  style={[
                    basicStyles.margin,
                    basicStyles.alignCenter,
                    styles.profileContainer,
                  ]}>
                  {liveStories ? (
                    <View style={[styles.userImage, styles.storiesStyle]}>
                      <VendorStories
                        liveStories={liveStories}
                        handlePostComment={this.handlePostComment}
                        handleReportStory={this.handleReportStory}
                        handleStoryReaction={this.handleStoryReaction}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      underlayColor="transparent"
                      onPress={this.handleProfileImage}
                      style={styles.userImage}>
                      <Image
                        source={{uri: vendorImage}}
                        resizeMode="cover"
                        style={styles.profileImgStyle}
                      />
                    </TouchableOpacity>
                  )}
                  {/* <TouchableOpacity style={styles.editImage}>
                              <Material size={14} name={'pencil'} color="#fff" />
                            </TouchableOpacity> */}
                  <Text style={[styles.profileNameStyle]}>{vendorName}</Text>

                  <Text
                    style={[
                      basicStyles.textAlign,
                      {
                        fontSize: wp(3.6),
                        padding: wp(2),
                        paddingHorizontal: wp(8),
                        color: '#666',
                      },
                    ]}>
                    {vendorAddress}
                  </Text>

                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.marginBottom,
                    ]}>
                    <View style={styles.detailTile}>
                      <Text style={styles.tileTitle}>Followers</Text>
                      <Text style={styles.tileData}>{followCount}</Text>
                    </View>

                    <View style={basicStyles.separatorVertical} />

                    <View style={styles.detailTile}>
                      <Text style={styles.tileTitle}>Likes</Text>
                      <Text style={styles.tileData}>{likesCount}</Text>
                    </View>

                    <View style={basicStyles.separatorVertical} />

                    <View style={styles.detailTile}>
                      <Text style={styles.tileTitle}>Rating</Text>
                      <Text style={styles.tileData}>
                        {avgRatings}{' '}
                        <Text style={styles.textSmall}>({ratingCount})</Text>
                      </Text>
                    </View>
                  </View>

                  {followStatus ? (
                    <TouchableOpacity
                      style={[styles.followingButton, basicStyles.directionRow]}
                      onPress={this.handleFollowVendor}>
                      <Image
                        source={checked_green}
                        resizeMode="cover"
                        style={styles.checkIcon}
                      />
                      <Text style={[basicStyles.text, basicStyles.greenColor]}>
                        Following
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.followButton}
                      onPress={this.handleFollowVendor}>
                      <Text style={[basicStyles.text, basicStyles.themeColor]}>
                        + Follow
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}>
            <View style={{borderTopWidth: 0.5, borderColor: '#9997'}}>
              <TabView
                initialLayout={initialLayout}
                navigationState={tabView}
                renderScene={sceneMap}
                onIndexChange={handleTabIndexChange}
                renderTabBar={this.renderTabBar}
              />
            </View>
          </ParallaxScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textSmall: {
    fontSize: wp(3.5),
    fontWeight: '400',
  },
  tileTitle: {
    fontSize: wp(3.8),
    color: '#555',
    marginBottom: wp(1),
  },
  tileData: {
    fontSize: wp(4.2),
    color: '#333',
    fontWeight: '700',
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#F57C00',
    paddingVertical: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: 5,
  },
  followingButton: {
    borderWidth: 1,
    borderColor: '#2BA65C',
    paddingVertical: wp(1),
    paddingHorizontal: wp(2),
    borderRadius: 5,
  },
  checkIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1),
  },
  profileStory: {
    borderRadius: wp(15),
  },
  flatContainer: {
    flex: 1,
    backgroundColor: 'rgba( 0, 0, 0, 0.9 )',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    elevation: 5,
  },
  // profileContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'flex-end',
  //   paddingTop: hp(8),
  // },
  // profileImgStyle: {
  //   margin: wp(1),
  //   // marginLeft: wp(0.5),
  //   width: wp(14),
  //   aspectRatio: 1 / 1,
  //   borderRadius: 3,
  //   // marginVertical: hp(0.5),
  //   borderWidth: 2,
  //   borderColor: '#ffffff80',
  // },

  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  cartIconStyle: {
    position: 'absolute',
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    top: 8,
    right: 0,
  },

  vectorIconRow: {
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    alignSelf: 'flex-end',
  },
  profileNameStyle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: wp(4.2),
    marginLeft: wp(2),
  },
  tabBarIndicator: {
    backgroundColor: '#F57C00',
    borderRadius: hp(3),
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    // height: hp(6),
    // borderRadius: hp(3),
    // margin: wp(2),
    width: wp(100),
  },
  tabBarLabel: {
    // color: '#999',
    fontSize: wp(4),
    textTransform: 'capitalize',
    textAlignVertical: 'center',
    // marginTop: hp(-1),
    fontWeight: '700',
  },

  tabContainer: {
    backgroundColor: '#fff',
    // paddingTop: hp(3),
    // borderRadius: hp(4),
  },
  profileContainer: {
    flexDirection: 'column',
    marginTop: hp(-8.05),
    backgroundColor: '#fff',
    width: '100%',
    // paddingVertical: wp(2),
    paddingBottom: wp(4),
  },
  userImage: {
    marginTop: hp(-8.5),
  },
  storiesStyle: {
    margin: wp(1),
    height: wp(30),
    aspectRatio: 1 / 1,
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImgStyle: {
    // margin: wp(1),
    height: wp(30),
    aspectRatio: 1 / 1,
    borderRadius: wp(15),
    borderWidth: 4,
    borderColor: '#fff',
  },
  editImage: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#f6416c',
    height: wp(6),
    width: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(3),
  },

  bgStyle: {
    width: wp(100),
    aspectRatio: 2.5 / 1,
  },

  bgHeight: {
    height: hp(30),
    overflow: 'hidden',
  },
  detailTile: {
    paddingHorizontal: wp(4),
    alignItems: 'center',
  },
});
