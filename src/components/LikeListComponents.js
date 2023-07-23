import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

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

  handleShowProfileData = () => {
    const {item} = this.props;

    this.props.handlePopupShow(item);
  };

  render() {
    const {postId, userName, userImage, date} = this.props.item;

    return (
      <TouchableOpacity
        style={[
          basicStyles.paddingHalf,
          basicStyles.directionRow,
          styles.commentContainer,
        ]}
        onPress={this.handleShowProfileData}>
        <Image
          source={{uri: userImage}}
          resizeMode="cover"
          style={styles.userImg}
        />
        <View style={basicStyles.flexOne}>
          <Text style={basicStyles.heading}>{userName}</Text>
          <Text style={basicStyles.grayColor}>{date}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: '#fff',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
});
