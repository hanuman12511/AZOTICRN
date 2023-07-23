import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import your_story from '../assets/images/your_story.png';
import new_products from '../assets/images/new_products.jpg';
import ic_order from '../assets/icons/ic_order.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Style
import basicStyles from '../styles/BasicStyles';

export default class OrderPendingTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleGoToDetails = () => {
    let {item} = this.props;
    item.status = ['pending', 'dispatched', 'process', 'ready'];

    this.props.nav.push('OrderDetail', {item});
  };

  onCancelPress = async () => {
    const {handleCancelOrder, item} = this.props;

    const {orderId} = item;

    await handleCancelOrder(orderId);
  };

  removeItem = async () => {
    Alert.alert(
      'Alert!',
      'Cancel This Order !',
      [
        {text: 'No', style: 'cancel'},
        {text: 'Cancel', onPress: this.onCancelPress},
      ],
      {
        cancelable: false,
      },
    );
  };

  handleOrderTrack = () => {
    let {item} = this.props;
    this.props.nav.navigate('OrderTrack', {item});
  };

  renderItem = ({item}) => {
    const {productId, productName, quantity, rate, totalAmount, image} = item;
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          basicStyles.paddingHalfBottom,
        ]}>
        <Text style={[basicStyles.heading, styles.title]}>{productName}</Text>
        <Text style={[basicStyles.grayColor, styles.quantity]}>
          ({quantity}x{rate})
        </Text>
        <Text style={[basicStyles.heading, styles.price]}>
          Rs. {totalAmount}
        </Text>
      </View>
    );
  };

  handleCallVendor = async () => {
    try {
      const {vendorContact} = this.props.item;

      let phoneNumber = '';
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${'+91' + vendorContact}`;
      } else {
        phoneNumber = `telprompt:${'+91' + vendorContact}`;
      }

      const supported = await Linking.canOpenURL(phoneNumber);

      if (supported) {
        Linking.openURL(phoneNumber);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {
      orderId,
      orderStatus,
      vendorName,
      vendorContact,
      vendorImage,
      orderTotal,
      selectedSlot,
      placedDate,
      deliveryDate,
      deliveryCharge,
      orderedItem,
    } = this.props.item;

    const orderContainer = {
      // marginVertical: hp(1.2),
      padding: wp(3),
      backgroundColor: '#fff',
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
      // marginTop: hp(0.5),
    };

    return (
      <View style={orderContainer}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
            basicStyles.paddingHalfBottom,
          ]}>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <View style={styles.iconContainer}>
              <Image
                source={ic_order}
                resizeMode="cover"
                style={styles.orderIcon}
              />
            </View>
            <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
              Order ID : {orderId}
            </Text>
          </View>
          <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
            {placedDate}
          </Text>
        </View>

        <Text
          style={[
            basicStyles.text,
            basicStyles.grayColor,
            basicStyles.paddingHalfBottom,
          ]}>
          Ordered form: <Text style={[basicStyles.heading]}>{vendorName}</Text>
        </Text>

        <FlatList
          data={orderedItem}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.itemSeparator}
          contentContainerStyle={styles.listContainer}
          refreshing={this.state.isListRefreshing}
          onRefresh={this.handleListRefresh}
        />

        <View style={[basicStyles.separatorHorizontal]} />
        <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
          <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
            Total
          </Text>
          <Text style={[basicStyles.heading, basicStyles.orangeColor]}>
            RS. {orderTotal}
          </Text>
        </View>
        <View style={[basicStyles.separatorHorizontal]} />

        <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
          <Text
            style={[basicStyles.headingSmall, basicStyles.orangeColor]}
            onPress={this.handleGoToDetails}>
            Track Order
          </Text>
          <TouchableOpacity onPress={this.handleCallVendor}>
            <Text style={[basicStyles.headingSmall, basicStyles.grayColor]}>
              Call Vendor
            </Text>
          </TouchableOpacity>
          <Text
            style={[basicStyles.headingSmall, basicStyles.grayColor]}
            onPress={this.removeItem}>
            Cancel Order
          </Text>
        </View>

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.padding,
            styles.infoBox,
          ]}> */}
        {/* <View style={styles.contentContainer}> */}
        {/* <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginBottomHalf,
              ]}>
              <Image
                source={{uri: vendorImage}}
                resizeMode="cover"
                style={styles.vImage}
              />
              <Text style={basicStyles.headingLarge}>{vendorName}</Text>
            </View> */}
        {/* <Text style={basicStyles.heading}>{orderName}</Text>
            <Text style={[styles.textStyle, basicStyles.marginTopHalf]}>
              Rs {finalAmount}
            </Text> */}

        {/* <View
              style={[
                basicStyles.directionRow,
                // basicStyles.marginTop1,
                // basicStyles.justifyBetween,
                // basicStyles.marginLeft,
              ]}>
              <Text style={[styles.textStyle, basicStyles.heading]}>
                Status -{' '}
              </Text>
              <Text style={[styles.textStyle]}>{orderStatus} </Text>
            </View> */}
        {/* </View> */}

        {/* <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.imageStyle}
          /> */}
        {/* </View> */}

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            basicStyles.paddingHorizontal,
          ]}>
          <Text
            style={[basicStyles.heading, basicStyles.orangeColor]}
            onPress={this.handleGoToDetails}>
            Track Order
          </Text>
          <TouchableOpacity
            style={styles.crossContainer}
            onPress={this.removeItem}>
            <Text style={styles.cancelText}>Cancel Order</Text>
          </TouchableOpacity>
        </View> */}

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.marginVentricle,
            basicStyles.marginLeft,
          ]}>
          <Text style={[styles.textStyle, basicStyles.text]}>Placed On - </Text>

          <Text style={[styles.textStyle, basicStyles.text]}>
            {placedDate}{' '}
          </Text>
        </View> */}
        {/* {deliveryDate ? ( */}
        {/* <View
            style={[
              basicStyles.directionRow,
              basicStyles.marginBottom,
              basicStyles.marginLeft,
            ]}>
            <Text style={[styles.textStyle, basicStyles.heading]}>
              Delivery On -{' '}
            </Text>

            <Text style={[styles.textStyle]}>{deliveryDate} </Text>
          </View> */}
        {/* ) : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
  },

  quantity: {
    textAlign: 'center',
    flex: 1,
  },

  price: {
    flex: 1,
    textAlign: 'right',
  },

  iconContainer: {
    backgroundColor: '#ff900040',
    width: wp(7),
    height: wp(7),
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },

  orderIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
});
