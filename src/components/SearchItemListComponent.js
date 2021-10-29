import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_plus from '../assets/icons/ic_plus.png';
import new_products from '../assets/images/new_products.jpg';
import ic_food from '../assets/icons/ic_food.png';
import ic_chef from '../assets/icons/ic_chef.png';
import ic_plus_white from '../assets/icons/ic_plus_white.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Style
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, storeData, getData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onLoginPress = () => {
    this.props.nav.navigate('Register');
  };

  handleAdd = async () => {
    // const userInfo = await getData(KEYS.USER_INFO);

    // Checking User Login
    // if (!userInfo) {
    //   Alert.alert(
    //     'Alert!',
    //     'You Need To Login?',
    //     [
    //       {text: 'Cancel', style: 'cancel'},
    //       {text: 'Login', onPress: this.onLoginPress},
    //     ],
    //     {
    //       cancelable: false,
    //     },
    //   );
    //   return;
    // } else {
    const {productId} = this.props.item;
    this.props.handleQualityPopup(productId);
    // }
  };

  handleChefDetail = () => {
    this.props.nav.navigate('CuVendors');
  };

  render() {
    const {
      vendorName,
      items,
      productLeft,
      orderTill,
      ProductName,
      vendorImage,
      deliveredIn,
      bgColor,
      deliverTime,
      leftTime,
      chefName,
      image,
    } = this.props.item;

    const orderContainer = {
      marginVertical: hp(0.5),
      backgroundColor: '#fff',
      borderBottomRightRadius: wp(5),
      borderTopLeftRadius: wp(5),
      marginTop: hp(1),
      elevation: 5,
    };

    return (
      <View style={orderContainer}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.padding,
          ]}>
          <Image source={image} resizeMode="cover" style={styles.imageStyle} />

          <View style={styles.contentContainer}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              {/* <Material
                name="chef-hat"
                color="#000"
                size={21}
                style={styles.iconRow}
              /> */}

              <Image
                source={ic_food}
                resizeMode="cover"
                style={styles.foodIcon}
              />
              <Text
                style={[
                  basicStyles.grayColor,
                  basicStyles.text,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                  // basicStyles.whiteColor,
                ]}>
                {ProductName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={this.handleChefDetail}
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                styles.chefName,
                basicStyles.alignCenter,
              ]}>
              {/* <Material
                name="chef-hat"
                color="#000"
                size={21}
                style={styles.iconRow}
              /> */}

              <Image
                source={ic_chef}
                resizeMode="cover"
                style={styles.foodIcon}
              />
              <Text
                style={[
                  // basicStyles.whiteColor,
                  basicStyles.text,
                  basicStyles.marginRight,
                  basicStyles.flexOne,
                ]}>
                {/* Chef -  */}
                {chefName}
              </Text>
            </TouchableOpacity>

            <View style={[basicStyles.directionRow]}>
              <Text style={[basicStyles.text]}>Order In</Text>

              <View style={styles.barPart}>
                <View style={styles.barContainer}>
                  {/* <LinearGradient colors={['#00b373', '#3b5998', '#192f6a']} style={styles.linearGradient}></LinearGradient> */}
                  <LinearGradient
                    start={{x: 0.0, y: 0.5}}
                    end={{x: 1.0, y: 1.5}}
                    locations={[0.5, 1.0, 0.0]}
                    colors={['#509f25', '#ff6000']}
                    style={styles.barStyle}
                  />
                  {/* <View style={styles.barStyle} /> */}
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    // basicStyles.justifyBetween,
                  ]}>
                  <Text
                    style={[
                      styles.textStyle,
                      basicStyles.text,
                      basicStyles.grayColor,
                    ]}>
                    {' '}
                    Order Till :{' '}
                  </Text>
                  <Text style={[styles.pmTextStyle]}> {leftTime}</Text>
                </View>
              </View>
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
              ]}>
              Delivery Time :
            </Text>
            <Text
              style={[
                styles.textStyle,
                // basicStyles.whiteColor,
              ]}>
              {' '}
              {deliverTime}
            </Text>
          </View>

          <Text
            style={[
              basicStyles.grayColor,
              basicStyles.text,
              // basicStyles.whiteColor,
            ]}>
            Item(s) Left : {items}
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            underlayColor="#f65e8380"
            onPress={this.handleAdd}>
            {/* <Material
              name="ic_plus_white"
              color="#fff"
              size={21}
              style={styles.iconRow}
            /> */}
            <Image
              source={ic_plus_white}
              resizeMode="cover"
              style={styles.addIcon}
            />
          </TouchableOpacity>
        </View>
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
  },

  listBottom: {
    // marginTop: hp(1),
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
});
