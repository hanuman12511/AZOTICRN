import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import ImageSlider from 'react-native-image-slider';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Libraries
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import DoubleClick from 'rn-double-click';

// icons
import ic_like_fill from '../assets/icons/ic_like_fill.png';
import ic_like_border from '../assets/icons/ic_like_border.png';
import ic_comment_border from '../assets/icons/ic_comment_border.png';
import ic_send from '../assets/icons/ic_send.png';
import ic_white_heart from '../assets/icons/ic_white_heart.png';

// Style
import basicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import GalTabCommentComponent from '../components/GalTabCommentComponent';
import {InstagramLoader} from 'react-native-easy-content-loader';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {postsSelectors, postsOperations} from 'state/ducks/posts';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

class GalleryDetailScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);
    this.item = item;

    this.state = {
      isLike: false,
      isProcessing: false,
      vendorName: '',
      city: '',
      vendorImage: null,
      mediaUrl: '',
      likes: '',
      description: '',
      comments: '',
      commentCount: 0,
      postTime: '',
      likedBy: '',
      likeStatus: false,
      contentLoading: true,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchPostDetail();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleCommentScreen = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need to Login First.\nPress LOGIN to Continue!',
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
      const item = this.props.navigation.getParam('item', null);

      this.props.navigation.navigate('Comment', {
        item,
        fetchNewsFeeds: this.fetchPostDetail,
      });
    }
  };

  onLoginPress = () => {
    this.props.navigation.navigate('Register');
  };

  renderItem = ({item}) => (
    <GalTabCommentComponent
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
    />
  );

  fetchPostDetail = async () => {
    try {
      const item = this.props.navigation.getParam('item', null);

      // starting loader
      // this.setState({isProcessing: true});

      // Fetching UserInfo
      const userInfo = await getData(KEYS.USER_INFO);

      const {postId} = item;

      let params = {
        postId,
      };
      if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          postId,
        };
      }

      await this.props.postDetail('Customers/postDetail', params, false);

      const {isPostDetail: response} = this.props;

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({
          isProcessing: false,
        });

        if (success) {
          const {posts} = response;
          const userInfo = await getData(KEYS.USER_INFO);
          const {
            postId,
            vendorId,
            vendorName,
            vendorAddress,
            follow,
            avgRatings,
            followCount,
            likesCount,
            ratingCount,
            vendorImage,
            city,
            description,
            feedDate,
            mediaType,
            mediaUrl,
            likes,
            likeStatus,
            likedBy,
            comments,
            commentCount,
            shareCount,
            postTime,
          } = posts;

          this.setState({
            vendorName,
            likesCount,
            ratingCount,
            vendorImage,
            city,
            description,
            feedDate,
            postTime,
            mediaType,
            mediaUrl,
            likes,
            likeStatus,
            likedBy,
            comments,
            commentCount,
            contentLoading: false,
          });
        } else {
          const {isAuthTokenExpired} = response;

          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            return;
          }
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLikeUnlike = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You Need to Login First.\nPress LOGIN to Continue!',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'LOGIN', onPress: this.onLoginPress},
          ],
          {
            cancelable: false,
          },
        );

        return;
      }

      const {postId} = this.item;
      const {likeStatus} = this.state;

      const params = {
        postId,
        like: !likeStatus,
      };

      await this.props.likePost('Customers/likePost', params, true);

      const {isLikePost: response} = this.props;

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({
          isProcessing: false,
          isLike: false,
        });

        if (success) {
          await this.fetchPostDetail();
          showToast(message);
        } else {
          const {isAuthTokenExpired} = response;

          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            return;
          }
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSharePost = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        Alert.alert(
          'Alert!',
          'You Need to Login First.\nPress LOGIN to Continue!',
          [
            {text: 'NO', style: 'cancel'},
            {text: 'LOGIN', onPress: this.onLoginPress},
          ],
          {
            cancelable: false,
          },
        );

        return;
      }
      // starting loader
      this.setState({isProcessing: true});

      const {postId} = this.item;

      const params = {
        postId,
      };

      // calling api
      await this.props.sharePost('Customers/sharePost', params);

      const {isSharePost: response} = this.props;

      // Processing Response
      if (response) {
        this.setState({
          isLoading: false,
          isProcessing: false,
          contentLoading: false,
          isListRefreshing: false,
        });

        const {success, isAuthTokenExpired} = response;

        if (success) {
          const {output} = response;

          await this.handleShare(output);
        } else {
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            // this.handleTokenExpire();
          }
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          isListRefreshing: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleShare = async referralInfo => {
    try {
      const {shareInfo} = referralInfo;
      const {title, message, androidUrl, iosUrl, image} = shareInfo;
      const {url: imageUrl, extension} = image;

      const base64ImageData = await this.encodeImageToBase64(imageUrl);
      if (!base64ImageData) {
        return;
      }

      const shareOptions = {
        title,
        subject: title,
        message: `${title}\n${message}\n${'Android'}\n${androidUrl}\n${'iOS'}\n${iosUrl}`,
        url: `data:image/${extension};base64,${base64ImageData}`,
      };

      // stopping loader
      this.setState({isProcessing: false});

      await Share.open(shareOptions);
    } catch (error) {
      console.log(error.message);
    }
  };

  encodeImageToBase64 = async imageUrl => {
    try {
      const fs = RNFetchBlob.fs;
      const rnFetchBlob = RNFetchBlob.config({fileCache: true});

      const downloadedImage = await rnFetchBlob.fetch('GET', imageUrl);
      const imagePath = downloadedImage.path();
      const encodedImage = await downloadedImage.readFile('base64');
      await fs.unlink(imagePath);
      return encodedImage;
    } catch (error) {
      console.log(error.message);
      return null;
    }
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

    this.setState({isLike: true});

    await this.handleLikeUnlike();
  };

  handleLikeScreen = async () => {
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
    const {postId} = this.item;
    this.props.navigation.navigate('Likes', {postId});
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {contentLoading} = this.state;

    if (contentLoading) {
      return (
        <SafeAreaView style={[styles.container]}>
          <HeaderComponent
            headerTitle="Vendors"
            nav={this.props.navigation}
            navAction="back"
            showCartIcon
            showAccountIcon
          />
          <View style={{flex: 1, borderTopWidth: 0.7, borderTopColor: '#888'}}>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        </SafeAreaView>
      );
    }

    const {
      vendorName,
      likesCount,
      ratingCount,
      vendorImage,
      city,
      description,
      postTime,
      mediaType,
      mediaUrl,
      likes,
      likeStatus,
      likedBy,
      comments,
      commentCount,
      isLike,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Vendors"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
          showAccountIcon
        />

        <ScrollView style={basicStyles.mainContainer}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            <Image
              source={{uri: vendorImage}}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
            <View style={basicStyles.flexOne}>
              <Text style={basicStyles.heading}>
                {vendorName}, {city}
              </Text>
              <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
                {postTime}
              </Text>
            </View>
          </View>

          <Text
            style={[
              basicStyles.text,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfBottom,
              basicStyles.marginTopHalf,
            ]}>
            {/* <Text style={basicStyles.textBold}>{vendorName}</Text>  */}
            {description}
          </Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyCenter,
              basicStyles.alignCenter,
              {borderWidth: 0.3, borderColor: '#888'},
            ]}>
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
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            {likeStatus ? (
              <TouchableOpacity
                onPress={this.handleLikeUnlike}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.likeBtnActive,
                ]}>
                <Image
                  source={ic_like_fill}
                  resizeMode="cover"
                  style={basicStyles.iconRowSmallMargin}
                />
                <Text style={[basicStyles.text, styles.activeText]}>
                  {likesCount}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={this.handleLikeUnlike}
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  styles.likeBtnInActive,
                ]}>
                <Image
                  source={ic_like_border}
                  resizeMode="cover"
                  style={basicStyles.iconRowSmallMargin}
                />
                <Text style={[basicStyles.text]}>{likesCount}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={this.handleCommentScreen}
              style={[
                basicStyles.marginRight,
                basicStyles.alignCenter,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_comment_border}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              <Text style={basicStyles.text}>{commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleSharePost}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_send}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[basicStyles.directionRow, basicStyles.paddingHorizontal]}
            onPress={this.handleLikeScreen}>
            <Text style={[basicStyles.text, basicStyles.textBold]}>
              {likedBy}
            </Text>
            <Text style={basicStyles.grayColor}> liked this post.</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.handleCommentScreen}>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.paddingHorizontal,
                basicStyles.marginTop,
              ]}>
              All Comments ({commentCount})
            </Text>
          </TouchableOpacity>

          <FlatList
            data={comments}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  newsFeed: postsOperations.newsFeed,
  commentPost: postsOperations.commentPost,
  reportOrBlock: postsOperations.reportOrBlock,
  likePost: postsOperations.likePost,
  sharePost: postsOperations.sharePost,
  postDetail: postsOperations.postDetail,
};

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isNewsFeed: postsSelectors.isNewsFeed(state),
  isCommentPost: postsSelectors.isCommentPost(state),
  isReportOrBlock: postsSelectors.isReportOrBlock(state),
  isLikePost: postsSelectors.isLikePost(state),
  isSharePost: postsSelectors.isSharePost(state),
  isPostDetail: postsSelectors.isPostDetail(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GalleryDetailScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  newsFeedsImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
    borderColor: '#666',
    borderWidth: 0.5,
  },
  imageBig: {
    width: wp(92),
    aspectRatio: 1 / 1,
  },
  likeBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f57c0040',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: wp(2),
  },
  likeBtnInActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: wp(2),
  },
  activeText: {
    color: '#f57c00',
    fontWeight: 'bold',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  commentContainer: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc4',
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
  activeHeart: {
    height: hp(10),
    aspectRatio: 1 / 1,
  },
});
