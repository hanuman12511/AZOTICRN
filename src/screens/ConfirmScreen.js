import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  FlatList,
  BackHandler,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Libraries
import SafeAreaView from 'react-native-safe-area-view';

// Image
import ic_order_confirm from '../assets/icons/ic_order_confirm.png';
import orderConfirmImage from '../assets/images/orderConfirmImage.png';

// Components
import HeaderComponent from '../components/HeaderComponent';
import ConfirmOrderItemComponent from '../components/ConfirmOrderItemComponent';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import basicStyles from '../styles/BasicStyles';

export default class CustomLoader extends Component {
  constructor(props) {
    super(props);

    const response = props.navigation.getParam('response', null);

    const {
      message,
      orderTotal,
      orderedItem,
      paymentMode,
      placed,
      vendorName,
      selectedSlot,
      discount,
      subTotal,
      tax,
      deliveryCharges = 0,
    } = response;

    this.state = {
      opacity: new Animated.Value(0),
      visible: false,
      discount,
      message,
      orderTotal,
      orderedItem,
      paymentMode,
      placed,
      vendorName,
      selectedSlot,
      subTotal,
      tax,
      deliveryCharges,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    this.handleAnimation();
    setInterval(() => {
      this.setState({
        visible: !this.state.visible,
      });
    }, 10000);
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleAnimation = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  handleOrder = () => {
    this.props.navigation.navigate('OrdersNav');
  };

  handleHome = () => {
    this.props.navigation.navigate('NewsNavS');
  };

  renderItem = ({item}) => (
    <ConfirmOrderItemComponent
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const animatedImageStyle = [
      {
        opacity: this.state.opacity,
        transform: [
          {
            scale: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
      },
      styles.checkMark,
    ];

    const {
      message,
      orderTotal,
      orderedItem,
      paymentMode,
      placed,
      vendorName,
      selectedSlot,
      discount,
      subTotal,
      tax,
      deliveryCharges,
    } = this.state;

    return (
      <SafeAreaView style={basicStyles.container}>
        <HeaderComponent
          headerTitle="Order Confirmation"
          nav={this.props.navigation}
          navAction="back"
        />
        <ScrollView style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.orderCImage}>
              <Animated.Image
                source={orderConfirmImage}
                resizeMode="cover"
                style={animatedImageStyle}
              />
            </View>

            <Text style={styles.checkText}>
              Thank you! Your Order has been Received.
            </Text>

            <Text style={styles.para}>{message}</Text>
          </View>

          <View style={styles.bottomPartContainer}>
            <Text
              style={[basicStyles.headingLarge, basicStyles.paddingHalfBottom]}>
              Items in the order
            </Text>

            <Text style={basicStyles.textLarge}>
              Vendor :{' '}
              <Text
                style={[
                  basicStyles.textLarge,
                  basicStyles.textBold,
                  {color: '#333'},
                ]}>
                {vendorName}
              </Text>
            </Text>

            <Text style={basicStyles.textLarge}>
              Slot :{' '}
              <Text
                style={[
                  basicStyles.textLarge,
                  basicStyles.textBold,
                  {color: '#333'},
                ]}>
                {selectedSlot.slot}
              </Text>
            </Text>
            <View style={basicStyles.flexOne}>
              <FlatList
                data={this.state.orderedItem}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfTop,
              ]}>
              <Text style={basicStyles.headingSmall}>Sub Total</Text>
              <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                ₹ {subTotal}
              </Text>
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfTop,
              ]}>
              <Text style={basicStyles.headingSmall}>Discount</Text>
              <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                - ₹ {discount}
              </Text>
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfTop,
              ]}>
              <Text style={basicStyles.headingSmall}>Delivery Charges</Text>
              <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                ₹ {deliveryCharges}
              </Text>
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfTop,
              ]}>
              <Text style={basicStyles.headingSmall}>Tax</Text>
              <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                ₹ {tax}
              </Text>
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.paddingHalfTop,
              ]}>
              <Text style={basicStyles.headingSmall}>Total</Text>
              <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
                ₹ {orderTotal}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={this.handleHome}
            style={[styles.homeButton]}>
            <Text style={styles.saveButtonText}>Home</Text>
          </TouchableOpacity>

          {/* <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.padding,
              basicStyles.marginTop,
              basicStyles.justifyBetween,
            ]}>
            <TouchableOpacity
              onPress={this.handleOrder}
              style={styles.checkButton}>
              <Text style={[styles.saveButtonText]}>Check Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleHome}
              style={[styles.homeButton, basicStyles.marginLeft]}>
              <Text style={styles.saveButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  topContainer: {
    backgroundColor: '#fff',
    marginTop: 4,
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
  orderCImage: {
    height: wp(36),
    width: wp(36),
    backgroundColor: '#F57C0020',
    borderRadius: wp(18),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    height: wp(20),
    aspectRatio: 1 / 1,
  },
  checkText: {
    marginVertical: hp(2),
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: wp(2),
    paddingHorizontal: wp(8),
  },
  para: {
    color: '#757575',
    fontSize: wp(4.5),
    textAlign: 'center',
    paddingHorizontal: wp(4),
  },
  checkButton: {
    backgroundColor: '#318956',
    width: wp(35),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButton: {
    backgroundColor: '#ff9000',
    height: hp(6),
    // borderRadius: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: '700',
  },
  bottomPartContainer: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 4,
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
});
