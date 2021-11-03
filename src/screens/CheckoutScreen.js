import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import PlaceOrderComponent from '../components/PlaceOrderComponent';
import TimeSlotComponent from '../components/TimeSlotComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

// Styles
import basicStyles from '../styles/BasicStyles';

// Icons
import ic_visa from '../assets/icons/ic_visa.png';
import ic_mastercard from '../assets/icons/ic_mastercard.png';
import ic_mastercard_2 from '../assets/icons/ic_mastercard_2.png';
import ic_american_express from '../assets/icons/ic_american_express.png';

// Images

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
// UserPreference
import {KEYS, storeData, getData, clearData} from 'state/utils/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    const info = props.navigation.getParam('info', null);

    const {
      itemTotal,
      discount,
      deliveryCharges,
      subTotal,
      tax,
      total,
      addressInfo,
    } = info;

    this.state = {
      // cartContent: cartList,
      itemTotal,
      discount,
      deliveryCharges,
      subTotal,
      tax,
      total,
      cartItemCount: 0,
      addressInfo,
      // isLoading: true,
      slotsInfo: null,
      status: null,
      selectedSlot: null,
      selectedSlotIndex: -1,
      selectedTimeSlotId: null,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    // this.fetchCheckout();
    this.fetchCartItemCount();
  }

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
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

          this.setState({
            cartItemCount,
            isLoading: false,
            isListRefreshing: false,
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

  cartItem = ({item}) => (
    <PlaceOrderComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleChangeAddress = () => {
    this.props.navigation.pop();
  };

  handleSelectSlotDate = (selectedSlot, selectedSlotIndex) => () => {
    this.setState({selectedSlot, selectedSlotIndex});
  };

  selectTimeSlotCallback = selectedTimeSlotId => {
    this.setState({selectedTimeSlotId});
  };

  renderSlots = () => {
    const {slotsInfo, selectedSlotIndex} = this.state;

    return slotsInfo.map((slot, index) => {
      const {day, alias} = slot;

      let slotContainerStyle = [styles.dayTab];
      let slotDayStyle = [styles.day];
      let slotSubHeadingStyle = [styles.subHeading];
      if (selectedSlotIndex === index) {
        slotContainerStyle.push(styles.active);
        slotDayStyle.push(styles.activeText);
        slotSubHeadingStyle.push(styles.activeText);
      }

      return (
        <TouchableOpacity
          onPress={this.handleSelectSlotDate(slot, index)}
          underlayColor="#ff900080"
          style={slotContainerStyle}
          key={index}>
          <View>
            <Text style={slotDayStyle}>{day}</Text>
            <Text style={slotSubHeadingStyle}>{alias}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  renderItem = ({item}) => (
    <TimeSlotComponent
      item={item}
      selectedTimeSlotId={this.state.selectedTimeSlotId}
      selectTimeSlotCallback={this.selectTimeSlotCallback}
    />
  );

  handlePayment = () => {
    const {navigate, getParam} = this.props.navigation;
    const info = getParam('info', null);

    const {addressInfo} = this.state;

    if (!addressInfo) {
      Alert.alert('Alert!', 'Please Select Delivery Address.');
      return;
    }

    info.address = addressInfo.address;
    navigate('Payment', {info});
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }
    const {
      addressInfo,
      cartItemCount,
      itemTotal,
      discount,
      deliveryCharges,
      tax,
      total,
      selectedSlot,
      selectedTimeSlotId,
      slotsInfo,
    } = this.state;

    // const {slots} = selectedSlot || {};

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.container}>
          <HeaderComponent
            navAction="back"
            nav={this.props.navigation}
            headerTitle="Checkout"
            showAccountIcon
          />
          <View style={basicStyles.mainContainer}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              {addressInfo ? (
                <View style={[styles.userInfo, styles.row]}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.heading}>{addressInfo.nickName}</Text>

                    <Text style={[styles.description]}>
                      {addressInfo.address}
                    </Text>

                    <View style={[basicStyles.directionRow]}>
                      <Text style={[basicStyles.headingSmall]}>
                        Landmark :{' '}
                      </Text>
                      <Text style={[styles.description]}>
                        {addressInfo.landMark}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    underlayColor="#ff900080"
                    onPress={this.handleChangeAddress}>
                    <Text style={[styles.changeAddressButton]}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.userInfo, styles.row]}>
                  <TouchableOpacity
                    underlayColor="#ff900080"
                    onPress={this.handleChangeAddress}>
                    <Text style={[styles.changeAddressButton]}>
                      Add Address
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* {slotsInfo ? (
                <View style={styles.deliverySlotsContainer}>
                  <Text
                    style={[
                      basicStyles.heading,
                      basicStyles.margin,
                      // basicStyles.marginBottom,
                    ]}>
                    Choose Slot
                  </Text>
                  <View style={styles.deliverySlotsDayContainer}>
                    {this.renderSlots()}
                  </View>

                  <View style={styles.slots}>
                    <FlatList
                      data={slots}
                      extraData={selectedTimeSlotId}
                      renderItem={this.renderItem}
                      numColumns="2"
                      keyExtractor={this.keyExtractor}
                      showsVerticalScrollIndicator={false}
                      ItemSeparatorComponent={this.itemSeparator}
                      contentContainerStyle={styles.listContainer}
                    />
                  </View>
                </View>
              ) : null} */}

              <View
                style={[
                  basicStyles.whiteBackgroundColor,
                  // basicStyles.margin,
                  basicStyles.padding,
                ]}>
                <View style={basicStyles.marginBottom}>
                  <Text style={basicStyles.heading}>Order Summary</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.paddingBottom,
                  ]}>
                  <Text style={basicStyles.text}>
                    Item(s) x {cartItemCount}
                  </Text>
                  <Text style={basicStyles.text}>₹ {itemTotal}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.paddingBottom,
                  ]}>
                  <Text style={basicStyles.text}>Discount</Text>
                  <Text style={basicStyles.text}>- ₹ {discount}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.paddingBottom,
                  ]}>
                  <Text style={basicStyles.text}>Delivery Charges</Text>
                  <Text style={basicStyles.text}>₹ {deliveryCharges}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.paddingBottom,
                  ]}>
                  <Text style={basicStyles.text}>Tax</Text>
                  <Text style={basicStyles.text}>₹ {tax}</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    // basicStyles.paddingBottom,
                  ]}>
                  <Text style={basicStyles.heading}>Total Price</Text>
                  <Text style={basicStyles.heading}>₹ {total}</Text>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.padding,
                  basicStyles.justifyCenter,
                  // basicStyles.lightBackgroundColor,
                  styles.wrap,
                ]}>
                <TouchableOpacity>
                  <Image
                    source={ic_visa}
                    resizeMode="cover"
                    style={styles.paymentOption}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={ic_mastercard}
                    resizeMode="cover"
                    style={styles.paymentOption}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={ic_mastercard_2}
                    resizeMode="cover"
                    style={styles.paymentOption}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={ic_american_express}
                    resizeMode="cover"
                    style={styles.paymentOption}
                  />
                </TouchableOpacity>
              </View>
              <View />
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.checkoutButtonView}
            onPress={this.handlePayment}>
            {/* <View style={styles.checkoutButtonView}>
              <Text style={styles.checkoutButtonText}>₹ {total}</Text>
              <View style={styles.checkoutContainer}> */}
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            {/* <Material
                  name="arrow-right"
                  color="#fff"
                  size={16}
                  style={styles.iconRow}
                />
              </View>
            </View> */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(1),
  },
  separator: {
    height: wp(2),
  },
  offerBackground: {
    width: wp(100),
    height: hp(15),
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: wp(3),
    height: hp(5.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(2),
    color: '#000',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  pinCodeInput: {
    fontSize: wp(3),
    height: hp(5.5),
    color: '#000',
    backgroundColor: '#ffffff80',
    flex: 1,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginRight: wp(3),
  },
  checkButton: {
    backgroundColor: '#ff9000',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    textAlign: 'center',
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  wrap: {
    flexWrap: 'wrap',
    backgroundColor: '#f5f5f5',
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  newAddress: {
    backgroundColor: '#ff9000',
    paddingVertical: hp(1.5),
    borderRadius: 5,
    width: wp(60),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    height: hp(5.5),
  },
  picAddress: {
    paddingVertical: hp(1),
    borderRadius: 5,
    width: wp(32),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#ff9000',
    height: hp(5.5),
  },
  //
  userInfo: {
    backgroundColor: '#f5f5f5',
    padding: wp(2),
    marginTop: wp(2),
    marginLeft: wp(2),
    marginRight: wp(2),
  },
  infoContainer: {
    flex: 1,
    elevation: 5,
    paddingLeft: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heading: {
    fontSize: wp(3.7),
    marginBottom: wp(1),
    fontWeight: '700',
  },

  description: {
    fontSize: wp(3.2),
    fontWeight: '400',
    color: '#333',
    textAlign: 'justify',
    flex: 1,
    paddingRight: wp(3),
  },

  changeAddressButton: {
    borderWidth: 1,
    color: '#ff9000',
    borderColor: '#db9058',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1),
    borderRadius: 3,
    fontSize: wp(3),
  },

  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    color: '#444',
    fontSize: wp(3),
    marginRight: wp(2),
  },

  buttonText: {
    fontSize: wp(3),
    color: '#333',
  },
  checkoutButton: {
    padding: wp(2),
    borderRadius: 5,
  },
  checkoutButtonView: {
    backgroundColor: '#ff9000',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    borderRadius: 5,
    margin: wp(2),
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: '700',
  },
  deliverySlotsContainer: {
    flex: 1,
    // marginVertical: hp(2),
    borderBottomWidth: 0.5,
    paddingVertical: wp(2),
  },
  deliverySlotsDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#ccc',
    marginHorizontal: wp(2),
  },
  active: {
    backgroundColor: '#ff9000',
    borderBottomWidth: 1,
    borderBottomColor: '#ff9000',
  },
  activeText: {
    color: '#fff',
  },
  dayTab: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    // backgroundColor: '#f2f1f1',
    padding: wp(2),
  },
  day: {
    fontSize: wp(3),
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#333',
  },
  subHeading: {
    fontSize: wp(2.5),
    textAlign: 'center',
    color: '#333',
  },
});
