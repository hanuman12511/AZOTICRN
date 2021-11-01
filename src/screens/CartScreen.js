import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  FlatList,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import CartComponent from '../components/CartComponent';
import PeopleAlsoOrdered from '../components/PeopleAlsoOrdered';
import ProcessingLoader from '../components/ProcessingLoader';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

//Images
import new_products from '../assets/images/new_products.jpg';

// Icons
import ic_cart_black from '../assets/icons/ic_cart_black.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Styles
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, storeData, getData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemTotal: 0,
      discount: 0,
      deliveryCharges: 0,
      subTotal: 0,
      tax: 0,
      total: 0,
      isListRefreshing: false,
      cartList: null,
      isLoading: true,
      isProcessing: false,
      couponCode: '',
      promoCodeId: '',
      selectedSlot: {
        id: 0,
        day: '',
        date: '',
        slot: '',
      },
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchCartList();
  }

  backAction = () => {
    this.goBack();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchCartList = async () => {
    const {couponCode} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
        promoCode: couponCode,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/getCartList',
        params,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {
            itemTotal,
            discount,
            deliveryCharges,
            subTotal,
            cartList,
            tax,
            total,
            selectedSlot,
            promoCodeMessage,
          } = response;

          this.setState(
            {
              itemTotal,
              discount,
              deliveryCharges,
              subTotal,
              cartList,
              tax,
              total,
              status: null,
              selectedSlot,
              isLoading: false,
              isListRefreshing: false,
            },
            async () => {
              if (promoCodeMessage) {
                showToast(promoCodeMessage);
              }

              await this.fetchCartItemCount();
            },
          );
        } else {
          const {promoCodeMessage} = response;

          this.setState({
            itemTotal: 0,
            discount: 0,
            deliveryCharges: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
            status: message,
            cartList: null,
            isLoading: false,
            isListRefreshing: false,
            selectedSlot: {id: -1, slot: ''},
          });
          if (promoCodeMessage) {
            showToast(promoCodeMessage);
          }
          showToast(message);
          await this.fetchCartItemCount();
        }
        // }
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

  fetchCartItemCount = async () => {
    try {
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
          isListRefreshing: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleUpdateItem = async (cartId, quantity) => {
    try {
      // starting loader
      this.setState({isProcessing: true, isListRefreshing: false});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      // preparing params
      const params = {
        deviceId,
        cartId,
        quantity,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/updateCart',
        params,
      );

      this.setState({isProcessing: false, isListRefreshing: false});
      // processing response
      if (response) {
        const {success} = response;
        // stopping loader

        if (success) {
          // updating cart item count
          const {message} = response;

          await this.fetchCartList();
          showToast(message);
        } else {
          const {message} = response;
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

  handleDeleteItem = async cartId => {
    try {
      // starting loader
      this.setState({isProcessing: true, isListRefreshing: false});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      // preparing params
      const params = {
        deviceId,
        cartId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/deleteCartItem',
        params,
      );

      this.setState({isProcessing: false, isListRefreshing: false});
      // processing response
      if (response) {
        const {success} = response;
        // stopping loader

        if (success) {
          // updating cart item count
          const {message} = response;

          await this.fetchCartList();
          showToast(message);
        } else {
          const {message} = response;
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

  goBack = () => {
    this.props.navigation.navigate('Home');
  };

  onLoginPress = () => {
    this.props.navigation.push('Login');
  };

  handleAddress = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const {
      cartList,
      itemTotal,
      discount,
      deliveryCharges,
      subTotal,
      tax,
      total,
      promoCodeId,
      couponCode: promoCode,
      selectedSlot,
    } = this.state;

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
    } else if (!cartList) {
      Alert.alert(
        'Alert!',
        'Your cart is empty. Go back and add some item.?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Go', onPress: this.goBack},
        ],
        {
          cancelable: false,
        },
      );
    } else {
      this.props.navigation.navigate('SelectAddress', {
        info: {
          itemTotal,
          discount,
          deliveryCharges,
          subTotal,
          tax,
          total,
          promoCodeId,
          promoCode,
          selectedSlot,
        },
      });
    }
  };

  CartItem = ({item}) => (
    <CartComponent
      item={item}
      nav={this.props.navigation}
      deleteItem={this.handleDeleteItem}
      updateCart={this.handleUpdateItem}
    />
  );

  MoreItems = ({item}) => (
    <PeopleAlsoOrdered
      item={item}
      nav={this.props.navigation}
      deleteItem={this.handleDeleteItem}
      updateCart={this.handleUpdateItem}
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

  handlePromoCode = async () => {
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
    } else {
      const info = {selectCouponCallback: this.selectCouponCallback};
      this.props.navigation.push('PromoCode', {info});
    }
  };

  handleCouponApply = async () => {
    try {
      if (this.state.couponCode.trim() === '') {
        Alert.alert('', 'Please enter a coupon!', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }

      await this.fetchCartList();
    } catch (error) {
      console.log(error.message);
    }
  };

  selectCouponCallback = (appliedCoupon, promoCodeId) => {
    this.setState({
      couponCode: appliedCoupon,
      promoCodeId,
    });
  };

  handleCouponChange = changedText => {
    this.setState({couponCode: changedText});
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      itemTotal,
      discount,
      deliveryCharges,
      subTotal,
      tax,
      total,
      isProcessing,
      cartList,
      selectedSlot,
    } = this.state;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3.8),
      flex: 1,
      marginLeft: wp(2),
    };
    return (
      <SafeAreaView
        style={[
          basicStyles.container,
          basicStyles.whiteBackgroundColor,
          //   basicStyles.lightBackgroundColor,
        ]}>
        <HeaderComponent
          navAction="homeBack"
          showAccountIcon
          showCartIcon
          nav={this.props.navigation}
          headerTitle="Cart"
          // showHeaderLogo
        />
        {cartList ? (
          <View style={basicStyles.mainContainer}>
            <ScrollView style={basicStyles.mainContainer}>
              <View>
                <Text style={styles.slotText}>Booked Slot</Text>
                <View style={[styles.inputContainer]}>
                  <TouchableOpacity
                    // onPress={handlePress}
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.justifyBetween,
                    ]}>
                    <View style={styles.slotDesign} />
                    <Text style={labelStyle}>{selectedSlot.slot}</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={cartList}
                  renderItem={this.CartItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              </View>

              {/* <View style={styles.more}>
              <FlatList
                data={this.state.listItems}
                renderItem={this.MoreItems}
                keyExtractor={this.keyExtractor}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            </View> */}
            </ScrollView>

            <Text
              style={[
                basicStyles.heading,
                basicStyles.paddingHorizontal,
                basicStyles.marginTop,
              ]}>
              Promocode
            </Text>

            <View style={styles.inputBox}>
              <TextInput
                placeholder="Enter Promo Code"
                placeholderTextColor="#888"
                style={styles.input}
                value={this.state.couponCode}
                onChangeText={this.handleCouponChange}
              />

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={this.handleCouponApply}>
                <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[basicStyles.padding, {marginTop: hp(-2)}]}>
              <Text style={[basicStyles.textSmall, {color: '#888'}]}>
                Select Coupon{' '}
                <Text
                  style={[basicStyles.heading, {color: '#888'}]}
                  onPress={this.handlePromoCode}>
                  Here
                </Text>
              </Text>
            </View>

            <View style={styles.cartTopDetail}>
              {/* <View style={styles.row}>
              <Text style={styles.rowColumn}>M.R.P.</Text>
              <Text style={styles.rowColumn}>₹ {itemTotal}</Text>
            </View> */}

              {/* <View style={styles.row}>
              <Text style={styles.rowColumn}>Delivery Charges</Text>
              <Text style={styles.rowColumn}>₹ {deliveryCharges}</Text>
            </View> */}
              {/* <View style={styles.rowSeparator} /> */}

              <View style={styles.row}>
                <Text style={basicStyles.text}>Sub Total</Text>
                <Text style={basicStyles.text}>₹ {subTotal}</Text>
              </View>
              <View style={styles.row}>
                <Text style={basicStyles.text}>Discount</Text>
                <Text style={basicStyles.text}>- ₹ {discount}</Text>
              </View>
              <View style={styles.row}>
                <Text style={basicStyles.text}>Delivery Charges</Text>
                <Text style={basicStyles.text}>₹ {deliveryCharges}</Text>
              </View>
              <View style={styles.row}>
                <Text style={basicStyles.text}>Tax</Text>
                <Text style={basicStyles.text}>₹ {tax}</Text>
              </View>
              <View style={styles.row}>
                <Text style={basicStyles.heading}>Total</Text>
                <Text style={basicStyles.heading}>₹ {total}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={this.handleAddress}
              underlayColor="transparent">
              <View style={styles.checkoutButtonView}>
                <Text style={styles.checkoutButtonText}>
                  Choose Delivery Address
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
            <Text style={[basicStyles.noDataTextStyle, basicStyles.textLarge]}>
              Cart Empty! Add Some Item
            </Text>
            <TouchableOpacity
              onPress={this.goBack}
              style={basicStyles.marginTopHalf}>
              <Text style={[basicStyles.headingLarge, basicStyles.orangeColor]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  homeHeader: {
    height: hp(6),
  },
  slotText: {
    fontSize: wp(4),
    fontWeight: '700',
    marginLeft: wp(2),
    marginTop: wp(2),
    color: '#444',
  },
  inputContainer: {
    backgroundColor: '#bebebe70',
    height: hp(5.5),
    justifyContent: 'center',
    marginHorizontal: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#ccc8',
    marginVertical: wp(3),
  },
  inputBox: {
    paddingHorizontal: wp(4),
    paddingTop: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 5,
    // borderBottomColor: '#ccc4',
  },
  input: {
    height: hp(5),
    fontSize: wp(3.2),
    borderWidth: 1,
    borderColor: '#ccc4',
    flex: 1,
    marginRight: wp(3),
  },
  applyBtn: {
    // backgroundColor: '#F57C00',
    height: hp(5),
    width: wp(25),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerLogo: {
    width: hp(8),
    aspectRatio: 2 / 1,
  },
  cart_icon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  cartTopDetail: {
    // margin: wp(2),
    // backgroundColor: '#f2f1f1',
    borderTopWidth: 1,
    borderTopColor: '#ccc4',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc4',
    padding: wp(4),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp(1),
  },
  rowSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(1),
  },
  rowColumn: {
    fontSize: wp(3.5),
  },
  rowColumnBold: {
    fontSize: wp(3.5),
    fontWeight: '700',
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
    borderRadius: 5,
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
  // checkoutContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // checkoutButtonText: {
  //   fontSize: wp(3.5),
  //   color: '#fff',
  // },
  separator: {
    height: wp(2),
  },
  listContainer: {
    // padding: wp(2),
  },
  more: {
    padding: wp(4),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc4',
    borderTopColor: '#ccc4',
    marginVertical: wp(2),
  },
  slotDesign: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ff6000',
  },
});
