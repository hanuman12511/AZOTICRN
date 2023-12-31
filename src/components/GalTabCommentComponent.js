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
    const {comment, date, userImage, userName, replyCount} = this.props.item;
    return (
      <View
        style={[
          basicStyles.padding,
          basicStyles.directionRow,
          styles.commentContainer,
        ]}>
        <Image
          source={{uri: userImage}}
          resizeMode="cover"
          style={styles.userImg}
        />
        <View style={basicStyles.flexOne}>
          <Text style={basicStyles.heading}>{userName}</Text>
          <Text>{comment}</Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.marginTopHalf,
            ]}>
            <View style={basicStyles.directionRow}>
              <Text
                style={[
                  basicStyles.textSmall,
                  basicStyles.textBold,
                  basicStyles.graysColor2,
                ]}>
                Replied{' '}
              </Text>
              <Text style={[basicStyles.textSmall, basicStyles.graysColor2]}>
                ({replyCount ? replyCount : 0})
              </Text>
            </View>
            <Text style={basicStyles.grayColor}>{date}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc4',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
});
