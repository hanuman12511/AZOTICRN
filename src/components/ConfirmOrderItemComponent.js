import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Style
import basicStyles from '../styles/BasicStyles';

// Images
import your_story from '../assets/images/your_story.png';

export default class GalTabCommentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      image,
      productId,
      productName,
      quantity,
      rate,
      totalAmount,
    } = this.props.item;
    return (
      <View
        style={[
          basicStyles.paddingVentricle,
          basicStyles.directionRow,
          styles.commentContainer,
        ]}>
        <View style={basicStyles.flexOne}>
          <Text style={[basicStyles.heading, basicStyles.paddingHalfBottom]}>
            {productName}
          </Text>
          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text style={[basicStyles.text, {color: '#777'}]}>
              ({quantity}x{rate})
            </Text>
            <Text style={[basicStyles.text, basicStyles.textBold]}>
              ₹ {totalAmount}
            </Text>
          </View>
        </View>
        <Image
          source={{uri: image}}
          resizeMode="cover"
          style={styles.userImg}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc4',
    alignItems: 'center',
  },
  userImg: {
    width: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
    marginLeft: wp(3),
  },
});
