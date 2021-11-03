import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ImageSlider from 'react-native-image-slider';

import DoubleClick from 'rn-double-click';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// icons
import your_story from '../assets/images/your_story.png';
import product from '../assets/images/product.jpg';
import ic_like_border from '../assets/icons/ic_like_border.png';
import ic_like_fill from '../assets/icons/ic_like_fill.png';
import ic_comment_border from '../assets/icons/ic_comment_border.png';
import ic_comment_fill from '../assets/icons/ic_comment_fill.png';
import ic_send from '../assets/icons/ic_send.png';

// Style
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

export default class NewsFeedComponent extends Component {
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

    this.setState({isLike: false});

    if (likeStatus === true) {
      this.setState({likeStatus: false});
      likeStatus = false;
    } else if (likeStatus === false) {
      this.setState({likeStatus: true});
      likeStatus = true;
    }
    await handleLikeUnlike(likeStatus, postId);
  };

  handleVendorPage = () => {
    const {item} = this.props;
    this.props.nav.push('CuVendors', {item});
  };

  handelLikeScreen = async () => {
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
      this.props.nav.navigate('Likes', {postId});
    }
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

  // lastTap = null;
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

    this.setState({isLike: true});

    await this.handleLike();
  };

  render() {
    const {
      vendorName,
      city,
      vendorImage,
      mediaUrl,
      likes,
      description,
      feedDate,
      feedTime,
      comments,
    } = this.props.item;

    const {likeStatus, isLike} = this.state;

    return (
      <View style={[basicStyles.container, styles.feedsContainer]}>
        <View style={styles.contentContainer}>
          <TouchableHighlight
            onPress={this.handleVendorPage}
            underlayColor="transparent">
            <Image
              // source={{uri: vendorImage}}
              source={your_story}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
          </TouchableHighlight>

          <TouchableOpacity
            style={basicStyles.justifyCenter}
            onPress={this.handleVendorPage}>
            <Text style={basicStyles.heading}>{vendorName}</Text>
            <Text style={styles.locationText}>{feedDate}</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            basicStyles.text,
            basicStyles.paddingHorizontal,
            basicStyles.paddingBottom,
          ]}>
          Tag a friend who can finish this with you!
        </Text>

        <View style={[basicStyles.alignCenter, basicStyles.justifyCenter]}>
          <Image
            source={product}
            resizeMode="cover"
            style={{height: wp(94), aspectRatio: 1 / 1}}
          />
          <DoubleClick
            style={styles.likeHeartStyle}
            onClick={this.handleDoubleTap}>
            {isLike ? (
              <View>
                <Material name="heart" color="#f1f2f1" size={85} />
              </View>
            ) : (
              <View style={basicStyles.flexOne} />
            )}
          </DoubleClick>
        </View>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            {
              paddingHorizontal: wp(2.5),
              marginVertical: wp(2),
            },
          ]}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.flexOne,
            ]}>
            {likeStatus === true ? (
              <TouchableOpacity
                onPress={this.handleLike}
                style={[basicStyles.marginRight, styles.likeBtn]}>
                <Image
                  source={ic_like_border}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <Text style={[basicStyles.text]}>{likes}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={this.handleLike}
                style={[basicStyles.marginRight, styles.likeBtnActive]}>
                <Image
                  source={ic_like_fill}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <Text style={[basicStyles.text, styles.activeText]}>
                  {likes}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={this.handelCommentScreen}
              style={[
                basicStyles.marginRight,
                basicStyles.alignCenter,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_comment_border}
                resizeMode="cover"
                style={basicStyles.iconRow}
              />
              <Text style={basicStyles.text}>{comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handelComment}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_send}
                resizeMode="cover"
                style={basicStyles.iconRow}
              />
              <Text style={basicStyles.text}>1+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[basicStyles.text, basicStyles.paddingHorizontal]}>
          <Text style={basicStyles.textBold}>{vendorName}</Text> {description}
          Akash Banerjee and 417 others want this.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
  },

  textStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },

  pmTextStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },

  vectorIconRow: {
    width: 24,
    textAlign: 'center',
    marginRight: wp(1),
  },
  followButton: {
    width: wp(22),
    backgroundColor: '#318956',
    paddingVertical: wp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(2.5),
    borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#318956',
  },
  followingButton: {
    width: wp(22),
    paddingVertical: wp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: wp(2.5),
    borderTopLeftRadius: wp(2.5),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#318956',
  },
  nameText: {
    padding: wp(0.8),
    fontSize: wp(3.2),
  },
  buttonText: {
    color: '#fff',
  },

  newsFeedsImage: {
    height: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
    borderColor: '#666',
    borderWidth: 0.5,
  },
  locationText: {
    fontSize: wp(3),
  },
  newsFeedImage: {
    width: wp(100),
    aspectRatio: 1 / 1,
  },
  feedsContainer: {
    marginTop: hp(1.5),
    borderBottomColor: '#ccc8',
    borderBottomWidth: 4,
    paddingBottom: wp(4),
  },
  likeHeartStyle: {
    // borderWidth: 5,
    // borderColor: '#000',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: hp(15),
    top: 0,
    bottom: 0,
    width: wp(40),
    aspectRatio: 1.4 / 1,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f1f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  likeBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f57c0040',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  activeText: {
    color: '#f57c00',
    fontWeight: 'bold',
  },
});
