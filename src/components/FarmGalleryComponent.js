import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import ImageSlider from 'react-native-image-slider';

// Image
import image1 from '../assets/images/image1.jpeg';

import DoubleClick from 'rn-double-click';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Components

// Style
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from '../api/UserPreference';

export default class FarmGalleryComponent extends Component {
  constructor(props) {
    super(props);
    const {likeStatus} = props.item;
    this.state = {
      likeStatus,
      isLike: false,
    };
  }

  handleLike = async () => {
    const {handleLikeUnlike} = this.props;
    let {likeStatus} = this.state;
    const {postId} = this.props.item;

    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    this.setState({isLike: true});

    await handleLikeUnlike(likeStatus, postId);

    this.setState({isLike: false});

    if (likeStatus === true) {
      this.setState({likeStatus: false});
      likeStatus = false;
    } else if (likeStatus === false) {
      this.setState({likeStatus: true});
      likeStatus = true;
    }
  };

  handleVendorPage = () => {
    const {item} = this.props;
    this.props.nav.push('CuVendors', {item});
  };

  handelCommentScreen = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    } else {
      const {postId} = this.props.item;
      this.props.nav.navigate('Comment', {postId});
    }
  };

  onLoginPress = () => {
    this.props.nav.navigate('Register');
  };

  handleDoubleTap = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (this.state.likeStatus === true) {
      return;
    }
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    await this.handleLike();
  };

  handleGalleryDetail = () => {
    const {item} = this.props;
    this.props.nav.navigate('GalleryDetail', {item});
  };

  render() {
    const {
      vendorName,
      city,
      vendorImage,
      mediaUrl,
      likes,
      description,
      psotDate,
      comments,
      postTime,
      singleMediaImage,
    } = this.props.item;

    const {likeStatus, isLike} = this.state;

    return (
      <View style={[styles.imageContainer]}>
        <TouchableOpacity
          style={[basicStyles.container, styles.feedsContainer]}
          onPress={this.handleGalleryDetail}>
          <Image
            source={{uri: singleMediaImage}}
            resizeMode="cover"
            style={styles.imageTile}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedsContainer: {
    paddingHorizontal: 0.5,
    flexDirection: 'row',
  },
  imageTile: {
    width: '100%',
    aspectRatio: 1.1 / 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
  },
  imageContainer: {
    width: wp(50),
    borderWidth: 1,
    borderColor: '#fff',
  },

  textStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },
});
