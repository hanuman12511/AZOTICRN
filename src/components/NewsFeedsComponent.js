import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import ImageSlider from 'react-native-image-slider';

import DoubleClick from 'rn-double-click';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

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
import ic_white_heart from '../assets/icons/ic_white_heart.png';
import ic_send from '../assets/icons/ic_send.png';
import ic_show_more from '../assets/icons/ic_show_more.png';

// Style
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

export default class NewsFeedComponent extends Component {
  constructor(props) {
    super(props);
    const {likeStatus} = props.item;
    console.log('In Prop', likeStatus);
    this.state = {
      likeStatus,
      isLike: false,
      isLoggedIn: false,
      isMenuVisible2: false,
    };
  }

  componentDidMount() {
    this.fetchInfo();
  }

  fetchInfo = async () => {
    const userInfo = await getData(KEYS.USER_INFO);

    let isLoggedIn = userInfo ? true : false;
    this.setState({isLoggedIn});
  };

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
      likeStatus = false;
    } else if (likeStatus === false) {
      likeStatus = true;
    }
    await handleLikeUnlike(likeStatus, postId);
  };

  handleVendorPage = () => {
    const {item} = this.props;
    this.props.nav.push('CuVendors', {item});
  };

  handleLikeScreen = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    console.log(userInfo);
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
    const {postId} = this.props.item;
    this.props.nav.navigate('Likes', {postId});
  };

  handleShare = async () => {
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
    const {postId} = this.props.item;
    this.props.handleSharePost(postId);
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
      const {item} = this.props;

      this.props.nav.navigate('Comment', {
        item,
        fetchNewsFeeds: this.props.fetchNewsFeeds,
      });
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

  handleVendorDetail = () => {
    const {item} = this.props;

    item.initial = 0;

    item.activeStatus = false;

    this.props.nav.navigate('CuVendors', {
      item,
      refreshCallback: this.fetchCartItemCount,
    });
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleReportPop = () => {
    const {postId} = this.props.item;
    this.setState({isMenuVisible2: false});
    this.props.handleReportPopOn(postId);
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
      shareCount,
      likedBy,
    } = this.props.item;

    const {likeStatus, isLike, isLoggedIn} = this.state;
    console.log(description, 'In Ren', likeStatus);
    return (
      <View style={[basicStyles.container, styles.feedsContainer]}>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={this.handleVendorDetail}>
          <View underlayColor="transparent">
            <Image
              source={{uri: vendorImage}}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
          </View>

          <View style={[basicStyles.justifyCenter, basicStyles.flexOne]}>
            <Text style={basicStyles.heading}>
              {vendorName}, {city}
            </Text>
            <Text style={styles.locationText}>{feedDate}</Text>
          </View>
          {isLoggedIn ? (
            <View>
              <Menu
                visible={this.state.isMenuVisible2}
                anchor={
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                      this.setState({isMenuVisible2: true});
                    }}>
                    <Image
                      source={ic_show_more}
                      resizeMode="cover"
                      style={styles.showMoreIcon}
                    />
                  </TouchableOpacity>
                }
                onRequestClose={() => {
                  this.setState({isMenuVisible2: false});
                }}>
                <MenuItem onPress={this.handleReportPop}>Report Post</MenuItem>
              </Menu>
            </View>
          ) : null}
        </TouchableOpacity>

        <Text
          style={[
            basicStyles.text,
            basicStyles.paddingHorizontal,
            basicStyles.paddingHalfBottom,
            basicStyles.marginTopHalf,
          ]}>
          {description}
        </Text>

        <View style={[basicStyles.alignCenter, basicStyles.justifyCenter]}>
          <ImageSlider
            images={mediaUrl}
            style={{width: wp(100), aspectRatio: 1 / 1}}
          />
          <DoubleClick
            style={styles.likeHeartStyle}
            onClick={this.handleDoubleTap}>
            {isLike ? (
              <View>
                <Image
                  source={ic_white_heart}
                  style={styles.activeHeart}
                  resizeMode="cover"
                />
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
                style={[basicStyles.marginRight, styles.likeBtnActive]}>
                <Image
                  source={ic_like_fill}
                  resizeMode="cover"
                  style={styles.likeIcon}
                />
                <Text style={[basicStyles.text, styles.activeText]}>
                  {likes}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={this.handleLike}
                style={[basicStyles.marginRight, styles.likeBtn]}>
                <Image
                  source={ic_like_border}
                  resizeMode="cover"
                  style={styles.likeIcon}
                />
                <Text style={[basicStyles.text]}>{likes}</Text>
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
                style={styles.likeIcon}
              />
              <Text style={basicStyles.text}>{comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleShare}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_send}
                resizeMode="cover"
                style={styles.likeIcon}
              />
              {/* <Text style={basicStyles.text}>{shareCount}</Text> */}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={this.handleLikeScreen}>
          <Text style={[basicStyles.text, basicStyles.paddingHorizontal]}>
            <Text style={[basicStyles.text, basicStyles.textBold]}>
              {likedBy}
            </Text>
            <Text style={basicStyles.grayColor}> liked this post.</Text>
          </Text>
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    zIndex: 1,
    position: 'relative',
  },

  textStyle: {
    fontSize: wp(3),
    marginRight: wp(1),
  },
  activeHeart: {
    height: hp(10),
    aspectRatio: 1 / 1,
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
    color: '#999',
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
    color: '#999',
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
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  likeIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(1),
  },
  andOther: {
    color: '#666',
  },
  separator: {
    height: wp(5),
  },
  listContainer: {
    marginTop: wp(5),
    // padding: wp(2),
  },

  showMoreIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  buttonStyle: {
    padding: wp(1.5),
    borderRadius: wp(6),
    marginRight: wp(1),
    // backgroundColor: 'rgba(131,131,131,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
