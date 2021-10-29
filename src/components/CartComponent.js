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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialIcons';

// Images
import product from '../assets/images/product.jpg';

// Styles
import basicStyles from '../styles/BasicStyles';

//Images
// import ic_timer from '../assets/icons/ic_timer.png';
// import ic_delivery from '../assets/icons/ic_delivery.png';

// VectorIcons

export default class CartComponent extends Component {
  constructor(props) {
    super(props);
    const {quantity} = props.item;

    this.state = {
      quantity,
    };
  }

  handleAddition = async () => {
    let {quantity} = this.state;
    quantity = quantity + 1;
    this.setState({quantity});

    const {cartId} = this.props.item;

    const {updateCart} = this.props;
    try {
      let qty = +1;
      await updateCart(cartId, qty);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSubtraction = async () => {
    let {quantity} = this.state;

    quantity = quantity - 1;
    if (quantity > 0) {
      this.setState({quantity});
      const {cartId} = this.props.item;

      const {updateCart} = this.props;
      try {
        let qty = -1;

        await updateCart(cartId, qty);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      Alert.alert(
        'Alert!',
        'Confirm Item Removal?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Remove', onPress: this.onDeletePress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }
  };

  removeItem = async () => {
    Alert.alert(
      'Alert!',
      'Confirm Item Removal?',
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
    const {cartId} = this.props.item;
    const {deleteItem} = this.props;
    try {
      await deleteItem(cartId);
    } catch (error) {
      console.log(error.message);
    }
  };

  CartItem = ({item, index}) => {
    let ind = index + 1;
    return (
      <View
        style={[
          basicStyles.flexOne,
          basicStyles.directionRow,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
        ]}>
        <Text style={[basicStyles.text, styles.textTrans]}>
          #{ind} {item.name}
        </Text>
        <Text style={basicStyles.text}>₹ {item.price}</Text>
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {quantity} = this.state;
    const {
      addonDetail,
      customNotes,
      image,
      deliveredIn,
      deliveryDate,
      deliverySlot,
      vendorName,
    } = this.props.item;

    return (
      <View style={[styles.cartListContainer]}>
        {/* <TouchableOpacity
          style={styles.crossContainer}
          onPress={this.removeItem}>
          <Material
            name="remove-circle"
            color="#f65e83"
            size={21}
            style={styles.iconRow}
          />
        </TouchableOpacity> */}
        {/* 
        <View style={[basicStyles.directionRow, basicStyles.alignItems]}>
          <Text style={[basicStyles.heading]}>{vendorName}</Text>
        </View> */}

        <View style={[basicStyles.flexOne]}>
          <Text style={[basicStyles.headingLarge]}>{this.props.item.name}</Text>

          <Text style={[basicStyles.text, basicStyles.marginTopHalf]}>
            INR {this.props.item.price}
          </Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.justifyBetween,
              //   basicStyles.border,
            ]}>
            <View
              style={[basicStyles.directionRow, basicStyles.paddingHalfTop]}>
              <TouchableOpacity onPress={this.handleSubtraction}>
                <Text style={styles.addValue}>-</Text>
              </TouchableOpacity>

              <Text style={styles.quantity}>{quantity}</Text>

              <TouchableOpacity onPress={this.handleAddition}>
                <Text style={styles.lessValue}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTop,
              ]}>
              <Text style={styles.dateTextHead}>Delivery Date : </Text>
              <Text style={styles.dateText}>{deliveryDate}</Text>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTop,
              ]}>
              <Text style={styles.dateTextHead}>Delivery Slot : </Text>
              <Text style={styles.dateText}>{deliverySlot}</Text>
            </View> */}
        </View>

        <Image
          source={{uri: image}}
          resizeMode="cover"
          style={styles.cartImage}
        />
        {/* <View style={basicStyles.separatorHorizontal} /> */}

        {/* <View>
          {addonDetail ? (
            <View style={basicStyles.flexOne}>
              <Text style={basicStyles.heading}>Add On :</Text>
              <FlatList
                data={addonDetail}
                renderItem={this.CartItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          ) : null}
        </View> */}

        {/* {customNotes ? (
          <View style={[basicStyles.directionRow]}>
            <Text style={basicStyles.heading}>Note :</Text>
            <Text style={[styles.textStyle, basicStyles.flexOne]}>
              {' '}
              {customNotes}
            </Text>
          </View>
        ) : null} */}

        {/* <Text style={[basicStyles.text]}>{this.props.item.description}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cartListContainer: {
    backgroundColor: '#fafafa',
    paddingVertical: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  notificationContainer: {
    // backgroundColor: '#fff',
    // borderColor: '#f2f1f1',
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  crossContainer: {
    position: 'absolute',
    top: 10,
    right: 6,
    zIndex: 5,
    // backgroundColor: '#ccc',
  },
  iconRow: {
    textAlign: 'center',
    borderRadius: hp(2.5),
  },
  cartImage: {
    width: wp(22),
    aspectRatio: 1 / 1,
    borderRadius: 10,
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#9998',
    height: 26,
    width: 26,
    lineHeight: 26,
    textAlign: 'center',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#fff',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#9998',
    height: 26,
    width: 40,
    lineHeight: 26,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#9998',
    height: 26,
    width: 26,
    lineHeight: 26,
    textAlign: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#fff',
  },
  textTrans: {
    textTransform: 'capitalize',
  },
  textStyle: {
    fontSize: wp(3.5),
  },
  dateIcon: {
    width: hp(2.5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  dateTextHead: {
    fontSize: wp(3),
    color: '#222',
    fontWeight: '700',
  },
  dateText: {
    fontSize: wp(3),
    color: '#222',
    // fontWeight: '700',
  },
});
