import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import ic_photos from '../assets/icons/ic_photos.png';

const Story = (props) => (
  <TouchableOpacity style={[styles.screenInfo]}>
    <View style={[styles.topOptionContainer]}>
      <Image
        source={props.item.image}
        resizeMode="cover"
        style={styles.topOptionImg}
      />
    </View>
    <Text style={styles.screenInfoTitle}>{props.item.storyTitle}</Text>
  </TouchableOpacity>
);

export default Story;

const styles = StyleSheet.create({
  screenInfo: {
    width: wp(24),
    alignItems: 'center',
    // borderWidth: 1,
  },
  topOptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(212, 175, 55, .15)',
    borderWidth: 1.5,
    borderColor: '#f6416c',
  },

  topOptionImg: {
    height: wp(14),
    borderRadius: wp(7),
    aspectRatio: 1 / 1,
    // borderRadius: wp(10),
    marginVertical: hp(0.5),
  },
  screenInfoTitle: {
    color: '#333',
    fontSize: wp(3),
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: wp(1),
  },
});
