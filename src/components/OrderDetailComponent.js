import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_food from '../assets/icons/ic_food.png';
import ic_chef from '../assets/icons/ic_chef.png';
import ic_rupee from '../assets/icons/ic_rupee.png';

// Style
import basicStyles from '../styles/BasicStyles';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderItem = ({item, index}) => {
    let ind = index + 1;
    return (
      <View
        style={[
          basicStyles.flexOne,
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
          basicStyles.marginHorizontal,
        ]}>
        <Text
          style={[basicStyles.text, styles.textTrans, basicStyles.textBold]}>
          #{ind} {item.name}
        </Text>
        <Text style={basicStyles.text}>₹ {item.price}</Text>
      </View>
    );
  };

  handleRate = () => {
    const {item} = this.props;

    this.props.nav.push('ReviewRating', {item});
  };

  render() {
    const {
      vendorname,
      addonDetail,
      price,
      productName,
      productImage,
      deliveryDate,
      deliverySlot,
      orderStatus,
      productQuantity,
    } = this.props.item;

    const orderContainer = {
      marginVertical: hp(0.5),
      backgroundColor: '#f8f2df',
      borderBottomRightRadius: wp(5),
      borderTopLeftRadius: wp(5),
      marginTop: hp(2),
      elevation: 5,
    };

    return (
      <View style={[orderContainer]} onPress={this.handleChefDetail}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.padding,
          ]}>
          {orderStatus === 'delivered' ? (
            <TouchableOpacity
              style={styles.crossContainer}
              onPress={this.handleRate}>
              <Text style={styles.cancelText}>Rate Now</Text>
            </TouchableOpacity>
          ) : null}

          <Image
            source={{uri: productImage}}
            resizeMode="cover"
            style={styles.imageStyle}
          />

          <View style={styles.contentContainer}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_food}
                resizeMode="cover"
                style={styles.foodIcon}
              />
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.textCapitalize,
                  basicStyles.graysColor,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                  basicStyles.textBold,
                ]}>
                {productName}
              </Text>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_chef}
                resizeMode="cover"
                style={styles.foodIcon}
              />
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.graysColor,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                  basicStyles.textBold,
                ]}>
                {vendorname}
              </Text>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_rupee}
                resizeMode="cover"
                style={styles.foodIconR}
              />
              <Text
                style={[
                  basicStyles.text,
                  basicStyles.graysColor,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                  basicStyles.textBold,
                ]}>
                ₹ {price}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            styles.listBottom,
          ]}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.marginLeft,
            ]}>
            <Text
              style={[
                styles.textStyle,
                basicStyles.text,
                basicStyles.grayColor,
                basicStyles.textBold,
              ]}>
              Order Status :
            </Text>
            <Text
              style={[
                styles.textStyle,
                // basicStyles.whiteColor,
              ]}>
              {' '}
              {orderStatus}
            </Text>
          </View>

          <Text
            style={[
              basicStyles.grayColor,
              basicStyles.text,
              basicStyles.textBold,
            ]}>
            Item(s) : {productQuantity}
          </Text>
        </View>

        {deliveryDate && deliverySlot ? (
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.marginLeft,
              basicStyles.marginTop,
            ]}>
            <Text
              style={[
                styles.textStyle,
                basicStyles.text,
                basicStyles.grayColor,
                basicStyles.textBold,
              ]}>
              Deliver On :
            </Text>
            <Text
              style={[
                styles.textStyle,
                // basicStyles.whiteColor,
              ]}>
              {deliveryDate} {deliverySlot}
            </Text>
          </View>
        ) : null}

        {addonDetail ? (
          <View style={styles.flatContainer}>
            <Text style={[basicStyles.heading, basicStyles.margin]}>
              Add On(s)
            </Text>
            <FlatList
              data={addonDetail}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barPart: {
    marginLeft: wp(2),
  },

  contentContainer: {
    flex: 1,
    paddingLeft: wp(3),
  },

  chefName: {
    marginBottom: wp(1.5),
  },

  foodIconR: {
    width: hp(2.8),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  foodIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  barContainer: {
    height: hp(1.2),
    width: wp(38),
    marginVertical: hp(0.5),
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: hp(1),
  },
  barStyle: {
    height: hp(1),
    width: wp(26),
    // backgroundColor: '#db9058',
    borderRadius: hp(1),
  },
  imageStyle: {
    // marginTop: hp(2),
    width: hp(12),
    aspectRatio: 1 / 1,
    // margin: wp(1.5),
    borderRadius: hp(7.5),
    borderWidth: 2,
    borderColor: '#f6416c',
    marginTop: hp(-5),
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
    // marginLeft: wp(3),
  },
  textStyle: {
    fontSize: wp(3.2),
    textTransform: 'capitalize',
  },

  listBottom: {
    // marginTop: hp(1),
    // paddingBottom: wp(2),
    paddingRight: wp(2),
  },
  addButton: {
    backgroundColor: '#f65e83',
    width: hp(5),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(3),
    borderTopLeftRadius: wp(3),
  },
  addIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },

  linearGradient: {
    height: 10,
  },

  flatContainer: {
    marginBottom: hp(1),
  },
  textTrans: {
    textTransform: 'capitalize',
  },
  crossContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 8,
    backgroundColor: '#f65e83',
    borderRadius: wp(1),
  },
  cancelText: {
    fontSize: wp(2.9),
    // fontWeight: '700',
    color: '#fff',
    padding: wp(0.8),
  },
});
