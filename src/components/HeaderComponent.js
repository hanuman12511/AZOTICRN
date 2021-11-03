import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import back from '../assets/icons/back.png';
import ic_header_cart from '../assets/icons/ic_header_cart.png';
import ic_header_bell from '../assets/icons/ic_header_bell.png';
import ic_header_account from '../assets/icons/ic_header_account.png';

// Images
import logo_black from '../assets/images/logo_black.png';

// Styles
import basicStyles from '../styles/BasicStyles';

// User Preference
import {KEYS, getData} from 'state/utils/UserPreference';

// Redux
import {connect} from 'react-redux';
import {
  cartCountOperations,
  cartCountSelectors,
} from 'state/ducks/cartItemCount';

class HeaderComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cartItemCount: 0,
      userLogin: false,
      userImage: null,
      notificationCount: 0,
    };
  }
  // intervalID;

  componentDidMount() {
    this.fetchUser();
    // if (this.props.showCartIcon) {
    //   this.fetchCartItemCount();
    //   this.fetchNotificationCount();
    //   this.intervalID = setTimeout(this.componentDidMount.bind(this), 3000);
    // }
  }
  componentWillUnmount() {
    // clearTimeout(this.intervalID);
  }

  fetchUser = async () => {
    // Fetching userInfo
    const userInfo = await getData(KEYS.USER_INFO);
    if (userInfo) {
      const {image} = userInfo;

      this.setState({userLogin: true, userImage: image});
    }
  };

  fetchCartItemCount = async () => {
    try {
      const cartCount = await getData(KEYS.CART_ITEM_COUNT);

      if (cartCount) {
        const {cartItemCount} = cartCount;
        this.setState({cartItemCount});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
    try {
      const notificationCounts = await getData(KEYS.NOTIFICATION_COUNT);

      if (notificationCounts) {
        const {notificationCount} = notificationCounts;
        this.setState({notificationCount});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  toggleDrawer = () => {
    this.props.nav.openDrawer();
  };

  handleBack = () => {
    const {headerTitle, nav} = this.props;

    if (headerTitle === 'Add Default Address') {
      nav.pop();
    } else {
      nav.pop();
    }
  };

  handleHome = () => {
    this.props.nav.navigate('Home');
  };

  handleNotification = () => {
    this.props.nav.push('Notification');
  };

  handleCart = () => {
    this.props.nav.navigate('CartNav');
  };

  handleAccount = () => {
    const {userLogin} = this.state;
    if (userLogin === true) {
      this.props.nav.navigate('MyAccount');
    } else {
      this.props.nav.navigate('Login');
    }
  };

  render() {
    const {
      headerTitle,
      navAction,
      showHeaderLogo,
      showCartIcon,
      showAccountIcon,
      showNotification,
      cartItemCount,
    } = this.props;

    let handleNavAction;
    if (navAction === 'back') {
      handleNavAction = this.handleBack;
    } else if (navAction === 'homeBack') {
      handleNavAction = this.handleHome;
    }

    // const showNotificationBadge = notificationCount > 0;
    // const isNotificationCountUpToTwoDigit = notificationCount < 100;

    const {userImage, notificationCount} = this.state;
    const showCartBadge = cartItemCount > 0;
    const isCartCountTwoDigit = cartItemCount < 100;

    const showNotificationBadge = notificationCount > 0;
    const isNotificationCountTwoDigit = notificationCount < 100;

    return showHeaderLogo ? (
      <View style={styles.headerContainer}>
        <View style={styles.headerTopContainer}>
          <TouchableOpacity
            underlayColor="transparent"
            onPress={this.handleHome}>
            <Image
              source={logo_black}
              resizeMode="cover"
              style={styles.HeaderLogo}
            />
          </TouchableOpacity>
          <View style={basicStyles.directionRow}>
            {showCartIcon && (
              <TouchableOpacity
                underlayColor="transparent"
                style={basicStyles.marginLeft}
                onPress={this.handleCart}>
                <View>
                  <Image
                    source={ic_header_cart}
                    resizeMode="cover"
                    style={styles.headerIcon}
                  />
                  {showCartBadge && (
                    <View style={styles.cartBadgeContainer}>
                      {isCartCountTwoDigit ? (
                        <Text style={styles.cartBadge}> {cartItemCount} </Text>
                      ) : (
                        <Text style={styles.cartBadge}> 99 + </Text>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
            {showNotification && (
              <TouchableOpacity
                underlayColor="transparent"
                style={basicStyles.marginLeft}
                onPress={this.handleNotification}>
                <Image
                  source={ic_header_bell}
                  resizeMode="cover"
                  style={styles.headerIcon}
                />
                {showNotificationBadge && (
                  <View style={styles.cartBadgeContainer}>
                    {isNotificationCountTwoDigit ? (
                      <Text style={styles.cartBadge}>
                        {' '}
                        {notificationCount}{' '}
                      </Text>
                    ) : (
                      <Text style={styles.cartBadge}> 99 + </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}

            {showAccountIcon ? (
              <TouchableOpacity
                underlayColor="transparent"
                style={styles.profileImage}
                onPress={this.handleAccount}>
                {userImage ? (
                  <Image
                    source={{uri: userImage}}
                    resizeMode="cover"
                    style={styles.profileIcon}
                  />
                ) : (
                  <Image
                    source={ic_header_account}
                    resizeMode="cover"
                    style={styles.profileIcon}
                  />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    ) : (
      <View style={styles.headerContainer}>
        <View style={styles.headerTopContainer}>
          <TouchableOpacity
            underlayColor="transparent"
            onPress={handleNavAction}>
            <Image
              source={back}
              resizeMode="cover"
              style={basicStyles.iconColumn}
            />
          </TouchableOpacity>
          <Text style={styles.headerSubTitle}> {headerTitle} </Text>
          <View style={basicStyles.directionRow}>
            {showCartIcon && (
              <TouchableOpacity
                underlayColor="transparent"
                style={basicStyles.marginLeft}
                onPress={this.handleCart}>
                <View>
                  <Image
                    source={ic_header_cart}
                    resizeMode="cover"
                    style={styles.headerIcon}
                  />
                  {showCartBadge && (
                    <View style={styles.cartBadgeContainer}>
                      {isCartCountTwoDigit ? (
                        <Text style={styles.cartBadge}> {cartItemCount} </Text>
                      ) : (
                        <Text style={styles.cartBadge}> 99 + </Text>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {showNotification && (
              <TouchableOpacity
                underlayColor="transparent"
                style={basicStyles.marginLeft}
                onPress={this.handleNotification}>
                <Image
                  source={ic_header_bell}
                  resizeMode="cover"
                  style={styles.headerIcon}
                />
                {showNotificationBadge && (
                  <View style={styles.cartBadgeContainer}>
                    {isNotificationCountTwoDigit ? (
                      <Text style={styles.cartBadge}>
                        {' '}
                        {notificationCount}{' '}
                      </Text>
                    ) : (
                      <Text style={styles.cartBadge}> 99 + </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}

            {showAccountIcon ? (
              <TouchableOpacity
                underlayColor="transparent"
                style={basicStyles.marginLeft}
                onPress={this.handleAccount}>
                {userImage ? (
                  <Image
                    source={{uri: userImage}}
                    resizeMode="cover"
                    style={styles.profileIcon}
                  />
                ) : (
                  <Image
                    source={ic_header_account}
                    resizeMode="cover"
                    style={styles.profileIcon}
                  />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cartItemCount: cartCountSelectors.getCartItemCount(state),
});

const mapDispatchToProps = {
  getCartItemCount: cartCountOperations.getCartItemCount,
  // saveAvailableBalance: availableBalanceOperations.saveAvailableBalance,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(3),
    height: hp(7),
    justifyContent: 'center',
    position: 'relative',
    zIndex: 999,
  },
  HeaderLogo: {
    height: hp(3.5),
    aspectRatio: 4.48 / 1,
  },
  headerTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBottomContainer: {
    flexDirection: 'row',
    marginTop: wp(2),
    alignItems: 'center',
  },
  menuIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  cartIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  locationContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSubTitle: {
    fontSize: wp(3.5),
    color: '#333',
    flex: 1,
    marginLeft: wp(2),
  },
  selectLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: wp(3),
    color: '#fff',
    marginBottom: 0,
  },
  editIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  headerTitle: {
    flex: 1,
    fontSize: wp(3.5),
    color: '#fff',
  },
  cartBadgeContainer: {
    width: wp(3.3),
    height: wp(3.3),
    backgroundColor: '#f57d02',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -6,
    right: -5,
  },
  cartBadge: {
    color: '#fff',
    fontSize: wp(2.2),
    textAlign: 'center',
  },
  categoryButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    width: wp(20),
    borderRadius: 4,
    marginRight: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  allCategory: {
    color: '#333',
    fontSize: wp(3),
  },
  searchContainer: {
    flex: 1,
    height: hp(5.5),
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: wp(2),
  },
  searchLabel: {
    color: '#333',
    fontSize: wp(3),
  },
  notificationIconContainer: {
    marginLeft: 'auto',
    padding: wp(2),
  },
  notificationIcon: {
    width: wp(5.6),
    height: wp(5.6),
  },
  notificationBadgeContainer: {
    height: wp(3.3),
    paddingHorizontal: 3,
    backgroundColor: 'red',
    borderRadius: wp(1.7),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: wp(2),
    left: wp(2),
  },
  notificationBadge: {
    flex: 1,
    color: '#fff',
    fontSize: wp(2.2),
    textAlign: 'center',
  },
  headerIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  profileIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
  },
  profileImage: {
    marginLeft: wp(4),
  },
});
