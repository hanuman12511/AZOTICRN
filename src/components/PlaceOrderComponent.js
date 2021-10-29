import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import image1 from '../assets/images/image1.jpeg';

// Icons
import ic_delete_black from '../assets/icons/ic_delete_black.png';
import ic_down from '../assets/icons/ic_down.png';

export default class PlaceOrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMoreInfo = (moreInfo) => () => {
    this.setState((prevState) => ({[moreInfo]: !prevState[moreInfo]}));
  };

  render() {
    const {
      productId,
      name,
      quantity,
      customNotes,
      addonDetail,
      customId,
      image,
      price,
    } = this.props.item;
    const {name: addonName, price: addonPrice} = addonDetail;
    const {moreInfo} = this.state;

    return (
      <View style={basicStyles.lightBackgroundColor}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.padding,
            // basicStyles.whiteBackgroundColor,
          ]}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.cartImage}
          />

          <View style={[basicStyles.flexOne, basicStyles.justifyCenter]}>
            <View style={[basicStyles.directionRow]}>
              <Text style={[basicStyles.heading, basicStyles.flexOne]}>
                {name}
              </Text>

              <TouchableOpacity>
                <Image
                  source={ic_delete_black}
                  resizeMode="cover"
                  style={basicStyles.iconColumn}
                />
              </TouchableOpacity>
            </View>

            {/* <View style={[basicStyles.directionRow]}>
              <Text style={[basicStyles.text, basicStyles.flexOne]}>
                Sub Brand: {this.props.item.brandName}
              </Text>
            </View> */}

            <View style={[basicStyles.directionRow, basicStyles.paddingTop]}>
              <Text style={[styles.quantity, basicStyles.heading]}>QTY : </Text>
              <Text style={styles.quantity}> {quantity}</Text>
            </View>

            {/* <View style={[basicStyles.directionRow, basicStyles.marginTop]}>
              <Text style={basicStyles.text}>
                Item(s): {this.props.item.quantity}
              </Text>
            </View> */}

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.marginTop,
                basicStyles.justifyBetween,
              ]}>
              <Text style={basicStyles.heading}>₹ {price}</Text>
              <TouchableOpacity
                onPress={this.handleMoreInfo('moreInfo')}
                style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[basicStyles.text, basicStyles.pinkColor]}>
                  More Info
                </Text>
                <Image
                  source={ic_down}
                  resizeMode="cover"
                  style={styles.downIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {moreInfo && (
          <View
            style={[
              basicStyles.whiteBackgroundColor,
              styles.moreInfoContainer,
            ]}>
            <Text style={basicStyles.heading}>Add On - </Text>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
              ]}>
              <Text style={styles.moreInfoText}>{addonName.toUpperCase()}</Text>
              <Text style={styles.moreInfoText}>₹ {addonPrice}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cartImage: {
    width: wp(25),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  // quantity: {
  //   width: wp(10),
  // },
  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  moreInfoContainer: {
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  moreInfoList: {
    padding: hp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc80',
  },
  moreInfoText: {
    fontSize: wp(2.8),
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  quantity: {
    // borderWidth: 0.5,
    // borderColor: '#999',
    // height: 20,
    // width: 40,
    // lineHeight: 20,
    // textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
});
