import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
// Images
import ic_order from '../assets/icons/ic_order.png';
import no_star from '../assets/icons/no_star.png';
import ic_star from '../assets/icons/ic_star.png';
import ic_half_star from '../assets/icons/ic_half_star.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Style
import basicStyles from '../styles/BasicStyles';
import {log} from 'react-native-reanimated';

export default class OrderCompleteTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      starCount: 0,
    };
  }

  handleAdd = () => {};

  handleGoToDetails = () => {
    let {item} = this.props;
    item.status = ['delivered'];

    this.props.nav.push('OrderDetail', {item});
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

  handleHelp = () => {
    this.props.nav.navigate('Contact');
  };

  onStarRatingPress = async (ratingCount) => {
    await this.setState({
      starCount: ratingCount,
    });

    Alert.alert(
      'Rating',
      'Rate with ' + ratingCount + ' Stars',
      [
        {text: 'Cancel', onPress: this.handleCancel},
        {text: 'OK', onPress: this.handleRate},
      ],
      {
        cancelable: false,
      },
    );
    return;
    // await this.props.handleRate(rating, 2);
  };

  handleCancel = async () => {
    this.setState({starCount: 0});
  };
  handleRate = async () => {
    const {orderId} = this.props.item;
    const {starCount} = this.state;

    await this.props.handleRateProduct(starCount, orderId);
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
      rating,
      isRated,
    } = this.props.item;

    const orderContainer = {
      // marginVertical: hp(0.5),
      padding: wp(3),
      backgroundColor: '#fff',
      // backgroundColor: '#f8f4df',
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
            {deliveryDate}
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
          <View style={[basicStyles.directionRow]}>
            <Text
              style={[basicStyles.headingSmall, basicStyles.grayColor]}
              onPress={this.handleGoToDetails}>
              Rating
            </Text>
            <View
              style={[basicStyles.directionRow, basicStyles.marginLeftHalf]}>
              {isRated ? (
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={rating}
                  fullStar={ic_star}
                  halfStar={ic_half_star}
                  emptyStar={no_star}
                  starSize={18}
                  starStyle={styles.stars}
                />
              ) : (
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  fullStar={ic_star}
                  halfStar={ic_half_star}
                  emptyStar={no_star}
                  starSize={18}
                  selectedStar={(ratingCount) => {
                    this.onStarRatingPress(ratingCount);
                  }}
                  starStyle={styles.stars}
                />
              )}
            </View>
          </View>
          {/* <Text style={[basicStyles.headingSmall, basicStyles.grayColor]}>
            Call Vendor
          </Text> */}
          <Text
            style={[basicStyles.headingSmall, basicStyles.grayColor]}
            onPress={this.handleHelp}>
            Need Help?
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
            </View>
            <Text style={basicStyles.heading}>{orderName}</Text>
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
          />
        </View> */}

        {/* <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyCenter,
            basicStyles.paddingHorizontal,
          ]}>
          <Text style={styles.cancelText}>Order Delivered!</Text>
        </View> */}
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
