import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import ic_remove from '../assets/icons/ic_remove.png';

export default class CameraItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  removeImage = () => {
    const {itemIndex, handleRemoveImage} = this.props;
    handleRemoveImage(itemIndex);
  };

  render() {
    const {item} = this.props;
    const {uri} = item;
    console.log(item);
    return (
      <View>
        <TouchableOpacity
          style={styles.removeIconStyle}
          onPress={this.removeImage}>
          <Image
            source={ic_remove}
            resizeMode="cover"
            style={styles.removeIcon}
          />
        </TouchableOpacity>
        <Image
          source={{uri: uri}}
          resizeMode="cover"
          style={styles.cameraImage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cameraImage: {
    height: wp(23),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: 5,
    marginTop: -10,
  },
  removeIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
    // marginRight: wp(2),
    borderRadius: 5,
  },
  removeIconStyle: {
    alignSelf: 'flex-end',
    zIndex: 9,
  },
});
