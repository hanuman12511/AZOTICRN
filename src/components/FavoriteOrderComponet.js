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

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
// import new_products from '../assets/images/new_products.jpg';
import ic_food from '../assets/icons/ic_food.png';
import ic_plus_white from '../assets/icons/ic_plus_white.png';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

// Style
import basicStyles from '../styles/BasicStyles';

export default class FavoriteComponent extends Component {
  constructor(props) {
    super(props);
    const {favouriteStatus} = props.item;

    this.state = {
      quantity: 1,
      favouriteStatus,
    };
  }

  handleAddition = async () => {
    let {quantity} = this.state;
    quantity = quantity + 1;
    this.setState({quantity});

    const {id} = this.props.item;
    const {updateCart} = this.props;
    // try {
    //   await updateCart(id, quantity);
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  handleSubtraction = async () => {
    let {quantity} = this.state;

    quantity = quantity - 1;
    if (quantity > 0) {
      this.setState({quantity});
    }

    const {id} = this.props.item;
    // const {updateCart} = this.props;
    // try {
    //   await updateCart(id, quantity);
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  handleQualityPopup = () => {
    const {quantity} = this.state;

    const {productId} = this.props.item;

    this.props.handleQualityPopup(productId, quantity);
  };

  handleAddToFav = () => {
    Alert.alert(
      'Alert!',
      'Remove From Favorite?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', onPress: this.onDeletePress},
      ],
      {
        cancelable: false,
      },
    );
  };

  onDeletePress = async () => {
    let {favouriteStatus} = this.state;
    const {productId} = this.props.item;
    const {handleAddToFavs} = this.props;

    if (favouriteStatus === true) {
      await handleAddToFavs(productId);
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
      productPrice,
      vendorName,

      orderName,
    } = this.props.item;

    const {favouriteStatus, quantity} = this.state;

    const orderContainer = {
      // elevation: 5,
      backgroundColor: '#fff',
      paddingVertical: wp(2),
      // borderBottomRightRadius: wp(5),
      // borderTopLeftRadius: wp(5),
      // marginTop: hp(0.5),
    };

    return (
      <View style={orderContainer}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.padding,
            styles.infoBox,
          ]}>
          <View style={styles.contentContainer}>
            <View
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
            <Text style={basicStyles.heading}>{productName}</Text>
            <Text style={[styles.textStyle, basicStyles.marginTopHalf]}>
              Rs. {productPrice}
            </Text>
          </View>

          <Image
            source={{uri: productImage}}
            resizeMode="cover"
            style={styles.imageStyle}
          />
        </View>

        <TouchableOpacity
          style={[
            basicStyles.directionRow,
            basicStyles.justifyCenter,
            basicStyles.paddingHorizontal,
          ]}
          onPress={this.handleAddToFav}>
          <Text style={styles.cancelText}>Remove From Favorite</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barPart: {
    marginLeft: wp(2),
  },

  vImage: {
    width: wp(6),
    aspectRatio: 1 / 1,
    borderRadius: wp(4),
    marginRight: wp(2),
  },
  infoBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc4',
    marginBottom: wp(2),
  },
  contentContainer: {
    flex: 1,
  },

  chefName: {
    marginBottom: wp(1.5),
  },

  crossContainer: {
    // position: 'absolute',
    // top: 15,
    // right: 10,
    // zIndex: 8,
    // backgroundColor: '#ff9000',
    // borderRadius: wp(1),
    // paddingHorizontal: wp(1),
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
    width: wp(25),
    aspectRatio: 1 / 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc8',
    // marginTop: hp(-2.5),
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
  },
  textStyle: {
    fontSize: wp(3.5),
    color: '#333',
  },

  listBottom: {
    // marginTop: hp(1),
    paddingBottom: wp(3),
    paddingRight: wp(4),
  },
  addButton: {
    backgroundColor: '#db9058',
    width: hp(5),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(3),
    borderTopLeftRadius: wp(3),
  },
  cancelText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#219653',
  },
});
