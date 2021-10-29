import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import product from '../assets/images/product.jpg';
import ic_plus from '../assets/icons/ic_plus.png';

// Styles
import basicStyles from '../styles/BasicStyles';

export default class PeopleAlsoOrdered extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity style={[styles.cartListContainer]}>
        <Image source={product} resizeMode="cover" style={styles.cartImage} />
        <Text
          style={[
            basicStyles.textLarge,
            basicStyles.marginHorizontal,
            basicStyles.flexOne,
          ]}>
          Cheese
        </Text>
        <Image source={ic_plus} resizeMode="cover" style={styles.addIcon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cartListContainer: {
    borderWidth: 1,
    borderColor: '#ccc4',
    flexDirection: 'row',
    height: wp(10),
    width: wp(40),
    marginRight: wp(4),
    alignItems: 'center',
  },
  cartImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
  },
  addIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
});
