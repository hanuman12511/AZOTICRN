import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import Modal from 'react-native-modalbox';
// Components
import NewsFeedsComponent from '../../components/NewsFeedsComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import {showToast} from '../../components/CustomToast';

// Styles
import basicStyles from '../../styles/BasicStyles';

import {InstagramLoader} from 'react-native-easy-content-loader';

// UserPreference
import {KEYS, getData, clearData} from 'state/utils/UserPreference';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {postsSelectors, postsOperations} from 'state/ducks/posts';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

class NewsFeeds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsFeeds: null,

      cartItemCount: 0,
      contentLoading: true,
      isLoading: true,

      liveStories: null,
      isProcessing: false,
      status: 'No Post to display.',
      isListRefreshing: false,
      loadMore: false,
      offset: 0,
      canLoad: true,
      isReportPop: false,
      referralInfo: null,
    };
  }

  componentDidMount = async () => {
    this.fetchNewsFeeds();
    this.fetchNotificationCount();
  };

  componentWillUnmount = async () => {
    this._subscribe;
  };

  fetchNewsFeeds = async () => {
    try {
      const {offset, newsFeeds} = this.state;

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      // starting loader
      this.setState({contentLoading: true});

      const {deviceId} = deviceInfo;

      const userInfo = await getData(KEYS.USER_INFO);

      let params = null;

      if (!userInfo) {
        params = {offset, deviceId};
      } else if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          offset,
          deviceId,
        };
      }

      await this.props.newsFeed('Customers/newsFeed', params);

      const {isNewsFeed: response} = this.props;

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
          let {posts, loadMore, message} = response;

          if (loadMore === false) {
            this.setState({canLoad: false});
            return;
          }

          let newPosts = posts;
          if (newsFeeds !== null && offset !== 0) {
            newsFeeds.push(...newPosts);
            newPosts = newsFeeds;
          }

          this.setState({
            newsFeeds: newPosts,
            // status: message,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            // status: message,
            newsFeeds: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });

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
        // }
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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };

  handleLikeUnlike = async (likeStatus, postId) => {
    try {
      // starting loader
      // this.setState({isProcessing: true});

      const params = {
        postId,
        like: likeStatus,
      };

      await this.props.likePost('Customers/likePost', params, true);

      const {isLikePost: response} = this.props;

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({
          isProcessing: false,
        });

        if (success) {
          const {follow} = response;

          await this.fetchNewsFeeds();
          // showToast(message);
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

  onLoginPress = () => {
    this.props.navigation.navigate('Register');
  };

  handleSharePost = async postId => {
    try {
      // starting loader
      this.setState({isProcessing: true});
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

  renderItem = ({item}) => (
    <NewsFeedsComponent
      item={item}
      nav={this.props.navigation}
      fetchNewsFeeds={this.fetchNewsFeeds}
      handleLikeUnlike={this.handleLikeUnlike}
      handleSharePost={this.handleSharePost}
      handleReportPopOn={this.handleReportPopOn}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  itemSeparator2 = () => <View style={styles.separator2} />;

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loadMore) {
      return null;
    }
    this.setState({loadMore: true});

    return <ActivityIndicator style={{color: '#000'}} />;
  };

  handleLoadMore = async () => {
    let {offset, canLoad, newsFeeds} = this.state;
    if (newsFeeds.length < 15) {
      return;
    }
    try {
      if (canLoad) {
        var offs = ++offset;
        await this.setState({offset: offs});
        await this.fetchNewsFeeds(); // method for API call
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {payloadId} = userInfo;

        // preparing params
        const params = {
          payloadId,
        };
        // calling api
        const response = await makeNetworkRequest(
          'Notifications/getNotificationCount',
          params,
          true,
        );

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {notificationCount} = response;
            // await storeData(KEYS.NOTIFICATION_COUNT, {notificationCount});
            this.setState({
              notificationCount,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleReportPopOn = (postId = -1) => {
    this.postId = postId;
    this.setState({isReportPop: true});
  };

  renderQuestion = ({item}) => {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={this.reportHandler(item.reason)}>
        <Text style={[basicStyles.graysColor]}>{item.reason}</Text>
      </TouchableOpacity>
    );
  };

  reportHandler = reason => () => {
    Alert.alert('Report', 'Do you want to Block?', [
      {
        text: 'No',
        onPress: this.handleReportPost(this.postId, false, reason),
      },
      {
        text: 'Block',
        onPress: this.handleReportPost(this.postId, true, reason),
      },
    ]);
  };

  handleReportPost = (postId, is_block, reason) => async () => {
    // Checking Login
    this.reportPopClose();

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

    try {
      // starting loader
      this.setState({isProcessing: true, contentLoading: true});

      const params = {
        postId,
        is_report: 'Y',
        is_block: is_block === true ? 'Y' : 'N',
        reasion: reason,
      };

      await this.props.reportOrBlock('Customers/reportOrBlock', params, true);

      const {isReportOrBlock: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        this.setState({
          contentLoading: false,
          isProcessing: false,
        });

        if (success) {
          const {message} = response;
          await this.fetchNewsFeeds();
          showToast(message);
        } else {
          const {message, isAuthTokenExpired} = response;

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
          showToast(message);
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

  reportPopClose = () => {
    this.setState({isReportPop: false});
  };

  render() {
    const {liveStories, contentLoading, newsFeeds, cartItemCount, status} =
      this.state;

    let options = [
      {id: 1, reason: "It's spam"},
      {id: 2, reason: 'False information'},
      {id: 3, reason: "I just don't like it"},
      {id: 4, reason: 'Scam or fraud'},
      {id: 5, reason: "It's inappropriate"},
    ];

    if (contentLoading) {
      return (
        <SafeAreaView style={[styles.container]}>
          <View style={{flex: 1}}>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={[styles.container]}>
        <View style={[styles.container]}>
          <View style={basicStyles.flexOne}>
            {newsFeeds ? (
              <View style={styles.flatContainer}>
                <FlatList
                  data={newsFeeds}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                  ListFooterComponent={this.renderFooter.bind(this)}
                  onEndReachedThreshold={0.4}
                  onEndReached={this.handleLoadMore.bind(this)}
                  extraData={this.state}
                />
              </View>
            ) : (
              <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                <Text
                  style={[
                    basicStyles.noDataTextStyle,
                    basicStyles.graysColor2,
                    basicStyles.textBold,
                  ]}>
                  {status}
                </Text>
              </View>
            )}
          </View>

          {this.state.isProcessing && <ProcessingLoader />}
        </View>

        <Modal
          style={styles.modal2}
          position="bottom"
          isOpen={this.state.isReportPop}
          onClosed={this.reportPopClose}>
          <View style={basicStyles.flexOne}>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.textAlign,
                {
                  borderBottomWidth: 0.8,
                  borderBottomColor: '#555',
                  paddingVertical: wp(2),
                  color: '#333',
                },
              ]}>
              Report
            </Text>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.marginTop,
                basicStyles.graysColor,
              ]}>
              Why are you reporting this post?
            </Text>
            <Text
              style={[
                basicStyles.smallText,
                basicStyles.marginTopHalf,
                basicStyles.graysColor,
              ]}>
              Your report is anonymous, except if you're reporting an
              intellectual property infringement.
            </Text>
            <FlatList
              data={options}
              renderItem={this.renderQuestion}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator2}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        </Modal>
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
};

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isNewsFeed: postsSelectors.isNewsFeed(state),
  isCommentPost: postsSelectors.isCommentPost(state),
  isReportOrBlock: postsSelectors.isReportOrBlock(state),
  isLikePost: postsSelectors.isLikePost(state),
  isSharePost: postsSelectors.isSharePost(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeeds);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  filterIcon: {
    backgroundColor: '#853a7120',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
  },

  flatContainer: {
    flex: 1,
    // // marginHorizontal: wp(2),
    // backgroundColor: 'rgba( 0, 0, 0, 0.9 )',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // elevation: 5,
  },

  sortIcon: {
    backgroundColor: '#31895120',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },

  topOptionImg: {
    height: wp(15),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    marginVertical: hp(0.5),
  },
  screenInfo: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp(20),
    marginHorizontal: wp(1),
  },
  screenInfoTitle: {
    color: '#fff',
    fontSize: wp(3),
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: wp(3.2),
    textAlign: 'center',
    color: '#fff',
  },
  filterButton: {
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: {
    height: wp(2),
  },
  separator2: {
    height: wp(5),
  },
  listContainer: {
    // padding: wp(2),
  },
  vectorIconRow: {
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    alignSelf: 'flex-end',
  },
  modal2: {
    height: hp(80),
    width: '100%',
    // backgroundColor: 'rgba(255,255,255,255.3)',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
    // alignItems: 'flex-end',
    justifyContent: 'center',
    padding: wp(3),
    marginTop: hp(15),
    zIndex: 99999,
  },
  flatListContainer: {
    marginTop: wp(5),
    // padding: wp(2),
  },
});
