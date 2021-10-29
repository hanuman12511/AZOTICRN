import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {ProgressBar, Colors} from 'react-native-paper';

import * as Progress from 'react-native-progress';

import LinearGradient from 'react-native-linear-gradient';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_food from '../assets/icons/ic_food.png';
import your_story from '../assets/images/your_story.png';
import product from '../assets/images/product.jpg';

// VectorIcons

// Style
import basicStyles from '../styles/BasicStyles';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onLoginPress = () => {
    this.props.nav.navigate('Register');
  };

  fetchCartItemCount = async () => {
    const {fetchCartCount} = this.props;
    await fetchCartCount();
  };

  handleChefDetail = () => {
    const {item} = this.props;
    const {productType} = item;

    item.initial = 1;

    item.activeStatus = true;

    if (productType === 'restaurant') {
      this.props.nav.navigate('CuVendors', {
        item,
        refreshCallback: this.fetchCartItemCount,
      });
    } else if (productType === 'farm') {
      this.props.nav.navigate('CuFarms', {
        item,
        refreshCallback: this.fetchCartItemCount,
      });
    }
  };

  render() {
    const {
      vendorName,
      items,
      productLeft,
      orderTill,
      productName,
      productImage,
      vendorImage,
      deliveredIn,
      productPrice,
      progressBar,
    } = this.props.item;

    const orderContainer = {
      // marginVertical: hp(0.5),
      // backgroundColor: '#fff',
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
      // marginTop: hp(2),
      // elevation: 5,
    };

    return (
      <TouchableOpacity
        style={[orderContainer]}
        onPress={this.handleChefDetail}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.padding,
            styles.listData,
          ]}>
          <View style={styles.contentContainer}>
            <View
              // onPress={this.handleChefDetail}
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={{uri: vendorImage}}
                resizeMode="cover"
                style={styles.foodIcon}
              />
              <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                {vendorName}
              </Text>
            </View>

            <View style={basicStyles.flexOne}>
              <Text style={[basicStyles.headingLarge, basicStyles.marginRight]}>
                {productName}
              </Text>

              <Text style={[styles.tilePrice]}>Rs. {productPrice}</Text>
            </View>

            <View>
              <Text style={[styles.orderTill]}>
                Orders open Till :
                <Text style={basicStyles.textBold}> {orderTill}</Text>
              </Text>

              <View style={styles.barPart}>
                <View style={styles.barContainer}>
                  {/* <LinearGradient colors={['#00b373', '#3b5998', '#192f6a']} style={styles.linearGradient}></LinearGradient> */}
                  {/* <LinearGradient
                    start={{x: 0.0, y: 0.5}}
                    end={{x: 1.0, y: 1.5}}
                    locations={[0.5, 1.0, 0.0]}
                    colors={['#509f25', '#ff6000']}
                    style={styles.barStyle}
                  /> */}
                  {/* <View style={styles.barStyle} /> */}
                  {/* <ProgressBar
                    progress={0.9}
                    color={Colors.orangeA700}
                    style={styles.bar}
                  /> */}
                  <Progress.Bar
                    progress={progressBar}
                    color={Colors.orangeA700}
                    style={styles.bar}
                  />
                </View>
              </View>
            </View>
          </View>

          <View>
            <Image
              source={{uri: productImage}}
              resizeMode="cover"
              style={styles.imageStyle}
            />
            {/* <View style={[basicStyles.directionRow, styles.quantity]}>
              <Text style={styles.quButton}>-</Text>
              <Text style={[styles.quButton, styles.qbBorder]}>Add</Text>
              <Text style={styles.quButton}>+</Text>
            </View> */}
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            basicStyles.paddingHorizontal,
            styles.listBottom,
          ]}>
          {/* <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.alignCenter,
              // basicStyles.marginLeft,
            ]}>
            <Text
              style={[
                styles.textStyle,
                basicStyles.text,
                basicStyles.grayColor,
              ]}>
              Delivered in
            </Text>
            <Text
              style={[
                styles.textStyle,
                basicStyles.textBold,
                basicStyles.paddingHalfLeft,
              ]}>
              {deliveredIn}
            </Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  barPart: {
    marginRight: wp(10),
  },

  contentContainer: {
    flex: 1,
    // paddingLeft: wp(3),
  },

  chefName: {
    marginBottom: wp(1.5),
  },

  foodIcon: {
    width: hp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: hp(2.5),
  },

  barContainer: {
    flex: 1,
    marginRight: wp(4),
  },
  barStyle: {
    height: hp(1.5),
    width: wp(26),
    // backgroundColor: '#db9058',
    borderRadius: hp(1),
  },
  imageStyle: {
    // marginTop: hp(2),
    height: wp(30),
    aspectRatio: 1 / 1,
    // margin: wp(1.5),
    borderRadius: wp(2),
    // borderWidth: 0,
    // borderColor: '#f6416c',
    // marginTop: hp(-5),
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
    // marginLeft: wp(3),
  },
  textStyle: {
    fontSize: wp(3.8),
    color: '#555',
  },

  listBottom: {
    // marginTop: hp(1),
    paddingBottom: wp(2),
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
  quantity: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: -10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quButton: {
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    fontSize: wp(3),
  },
  qbBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  bar: {
    height: hp(0.95),
    borderRadius: 5,
    marginTop: wp(1),
    width: wp(35),
  },
  listData: {
    borderBottomColor: '#ccc4',
    borderBottomWidth: 1,
    marginBottom: wp(3),
    borderStyle: 'dashed',
  },
  tilePrice: {
    fontSize: wp(3.5),
    color: '#777',
  },
  orderTill: {
    fontSize: wp(3.5),
    color: '#777',
  },
});
