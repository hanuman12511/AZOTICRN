import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_like_border from '../assets/icons/ic_like_border.png';
import ic_like_fill from '../assets/icons/ic_like_fill.png';
import ic_plus_orange from '../assets/icons/ic_plus_orange.png';
import ic_plus_black from '../assets/icons/ic_plus_black.png';
import product from '../assets/images/product.jpg';

import {showToast} from '../components/CustomToast';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

// Style
import basicStyles from '../styles/BasicStyles';
import {KEYS, getData} from 'state/utils/UserPreference';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);
    const {favouriteStatus} = props.item;

    this.state = {
      quantity: 1,
      addFavStatus: favouriteStatus,
      activeProduct: false,
    };
  }

  componentDidMount() {
    this.updateStatus();
  }

  updateStatus = () => {
    const {productId: proId} = this.props.item;
    const {productId, activeStatus} = this.props;

    if (proId === productId && activeStatus === true) {
      this.setState({activeProduct: true});
      setTimeout(this.activeUpdate, 4000);
    }
  };

  activeUpdate = () => {
    this.setState({activeProduct: false});
  };

  handleAddition = async () => {
    let {quantity} = this.state;

    quantity = quantity + 1;
    this.setState({quantity});
  };

  handleSubtraction = async () => {
    let {quantity} = this.state;

    quantity = quantity - 1;
    if (quantity > 0) {
      this.setState({quantity});
    }

    const {id} = this.props.item;
  };

  handleQualityPopup = () => {
    const {quantity} = this.state;
    const {productId, productLeft} = this.props.item;
    // if (productLeft === 0) {
    //   showToast('Item Currently Unavailable');
    //   return;
    // }
    this.props.handleQualityPopup(productId, quantity);
  };

  handleAddToFav = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    console.log('userinfo', userInfo);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need to Login First.\nPress LOGIN to Continue!',
        [
          {text: 'NO', style: 'cancel'},
          {text: 'LOGIN', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );

      return;
    }
    const {addFavStatus} = this.state;
    const {productId} = this.props.item;
    const {handleAddToFavs} = this.props;

    if (addFavStatus === false) {
      const favStatus = true;
      await handleAddToFavs(productId, favStatus);
      this.setState({addFavStatus: true});
    } else if (addFavStatus === true) {
      const favStatus = false;
      await handleAddToFavs(productId, favStatus);
      this.setState({addFavStatus: false});
    }
  };

  render() {
    const {
      productLeft,
      deliveredIn,
      orderTill,
      productName,
      productImage,
      vendorImage,
      vendorName,
      productPrice,
    } = this.props.item;

    const {addFavStatus, quantity, activeProduct} = this.state;

    const orderContainer = {
      // backgroundColor: '#fcf5e7',
      // borderWidth: 0.5,
      // borderColor: '#ccc',
      // backgroundColor: '#fff',
      // marginVertical: hp(0.5),
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
      paddingTop: hp(1),
      // elevation: 5,
    };

    const newOrderContainer = {
      backgroundColor: '#faeed6',
      // marginVertical: hp(0.5),
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
      // marginTop: hp(1),
      // elevation: 5,
      paddingTop: hp(1),
    };

    return (
      <View style={activeProduct === true ? newOrderContainer : orderContainer}>
        <View
          style={[
            basicStyles.directionRow,
            // basicStyles.alignCenter,
            basicStyles.paddingHorizontal,
            basicStyles.marginBottom,
          ]}>
          <Image
            source={{uri: productImage}}
            resizeMode="cover"
            style={styles.imageStyle}
          />

          <View style={styles.contentContainer}>
            <Text style={[basicStyles.heading, basicStyles.marginRight]}>
              {productName}
            </Text>
            <Text style={[basicStyles.textSmall, basicStyles.marginRight]}>
              {vendorName}
            </Text>

            {addFavStatus === true ? (
              <TouchableOpacity
                style={[styles.favButtonContainer]}
                onPress={this.handleAddToFav}>
                <Image
                  source={ic_like_fill}
                  resizeMode="cover"
                  style={styles.addIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.favButtonContainer]}
                onPress={this.handleAddToFav}>
                <Image
                  source={ic_like_border}
                  resizeMode="cover"
                  style={styles.addIcon}
                />
              </TouchableOpacity>
            )}

            <View style={[basicStyles.directionRow, , basicStyles.marginTop]}>
              <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
                Rs. {productPrice}
              </Text>

              {/* <View style={styles.barPart}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    start={{x: 0.0, y: 0.5}}
                    end={{x: 1.0, y: 1.5}}
                    locations={[0.5, 1.0, 0.0]}
                    colors={['#509f25', '#ff6000', '#ff6000']}
                    style={styles.barStyle}
                  />
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={[basicStyles.text]}>{productLeft} Left</Text>
                  <Text style={[styles.pmTextStyle]}>
                    Order Till {orderTill}
                  </Text>
                </View>
              </View> */}
            </View>
            {/* <View
              style={[
                basicStyles.directionRow,
                // basicStyles.justifyBetween,
                // basicStyles.marginTop,
              ]}>
              <Text style={[styles.textStyle]}>Delivered in </Text>
              <Text
                style={[
                  styles.textStyle,
                  basicStyles.textBold,
                  {color: '#444'},
                ]}>
                {deliveredIn}
              </Text>
            </View> */}
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            styles.listBottom,
          ]}>
          {/* <View style={[basicStyles.directionRow, styles.addLess]}>
            <TouchableOpacity onPress={this.handleSubtraction}>
              <Text style={styles.addValue}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{quantity}</Text>

            <TouchableOpacity onPress={this.handleAddition}>
              <Text style={styles.lessValue}>+</Text>
            </TouchableOpacity>
          </View> */}

          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleQualityPopup}>
            <Image
              source={ic_plus_black}
              resizeMode="cover"
              style={styles.addIcon2}
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
  },

  chefName: {
    marginBottom: wp(1.5),
  },

  barContainer: {
    height: hp(1),
    width: wp(38),
    marginVertical: hp(0.5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
  },
  barStyle: {
    height: hp(0.8),
    width: wp(26),
    backgroundColor: '#853a77',
    borderRadius: hp(1),
  },
  imageStyle: {
    // marginTop: hp(2),
    width: wp(24),
    aspectRatio: 1 / 1,
    // margin: wp(1.5),
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: '#f65e83',
    marginRight: wp(3),
    // borderWidth: 2.5,
    borderColor: '#fbf3dd',
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
    paddingLeft: wp(2),
  },
  textStyle: {
    fontSize: wp(3.2),
    color: '#999',
  },

  addLess: {
    marginTop: hp(-4),
    backgroundColor: '#fff',
    marginLeft: wp(6),
    borderRadius: wp(1),
  },
  addButton: {
    // backgroundColor: '#f65e83',
    // width: hp(5),
    // height: hp(4),
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderBottomRightRadius: wp(3),
    // borderTopLeftRadius: wp(3),
    padding: wp(4),
    marginTop: hp(-7),
    position: 'absolute',
    right: 0,
  },

  favButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0.5,
  },
  foodIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  addIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  addIcon2: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    opacity: 0.5,
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 25,
    lineHeight: 25,
    textAlign: 'center',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 40,
    lineHeight: 25,
    textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 25,
    lineHeight: 25,
    textAlign: 'center',
  },
});
