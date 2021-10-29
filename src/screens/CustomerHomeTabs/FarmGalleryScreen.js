import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from '../../styles/BasicStyles';

// Images

// Components
import {showToast} from '../../components/CustomToast';
import FarmGalleryComponent from '../../components/FarmGalleryComponent';

// UserPreference
import {KEYS, clearData, getData} from '../../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

import {InstagramLoader} from 'react-native-easy-content-loader';

export default class FarmGalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      isLoading: true,
      contentLoading: true,
      isListRefreshing: false,
      loadMore: false,
      offset: 0,
      canLoad: true,
    };
  }

  componentDidMount = () => {
    this.fetchGallery();
  };

  fetchGallery = async () => {
    const {posts: oldPosts, offset} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      const {vendorId} = await this.props;

      const userInfo = await getData(KEYS.USER_INFO);

      let params = {
        vendorId,
        offset,
      };

      let response = null;

      if (!userInfo) {
        // calling api
        response = await makeRequest(
          BASE_URL + 'Customers/vendorGalleryListing',
          params,
        );
      } else if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          vendorId,
          offset,
        };

        // calling api
        response = await makeRequest(
          BASE_URL + 'Customers/vendorGalleryListing',
          params,
        );
      }

      // Processing Response
      if (response) {
        this.setState({
          isLoading: false,
          isProcessing: false,
          contentLoading: false,
          isListRefreshing: false,
        });

        const {success} = response;

        if (success) {
          const {posts, loadMore} = response;

          if (loadMore === false) {
            this.setState({canLoad: false});
            return;
          }

          let newPosts = posts;
          if (oldPosts !== null && offset !== 0) {
            oldPosts.push(...posts);
            newPosts = oldPosts;
          }

          this.setState({
            posts: newPosts,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            posts: null,
            status: message,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
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

  handleLikeUnlike = async (likeStatus, postId) => {
    try {
      // starting loader
      // this.setState({isProcessing: true});

      const params = {
        postId,
        like: likeStatus,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/likePost',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        // this.setState({
        //   isProcessing: false,
        // });

        if (success) {
          const {follow} = response;

          this.fetchGallery();
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });

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

  renderItem = ({item}) => (
    <FarmGalleryComponent
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

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
    let {offset, canLoad, posts} = this.state;

    if (posts.length < 20) {
      return;
    }
    try {
      if (canLoad) {
        var offs = ++offset;
        await this.setState({offset: offs});

        await this.fetchGallery(); // method for API call
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {posts, contentLoading} = this.state;
    return (
      <View style={styles.flatContainer}>
        {contentLoading === true ? (
          <View>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        ) : (
          <View style={styles.flatContainer}>
            {posts ? (
              <FlatList
                data={this.state.posts}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                numColumns="2"
                onRefresh={this.handleListRefresh}
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.2}
                onEndReached={this.handleLoadMore.bind(this)}
              />
            ) : (
              <View style={[basicStyles.noDataStyle]}>
                <Text style={[basicStyles.noDataTextStyle]}>
                  No Post Available Yet.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatContainer: {
    flex: 1,
  },
  textStyle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  separator: {
    height: wp(1),
  },
  listContainer: {
    paddingVertical: wp(1.5),
  },
});
