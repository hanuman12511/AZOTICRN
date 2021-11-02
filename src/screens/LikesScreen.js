import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import CommentUserDetailScreen from '../screens/CustomerHomeTabs/CommentUserDetailScreen';
import ProcessingLoader from '../components/ProcessingLoader';

import {FacebookLoader, Bullets} from 'react-native-easy-content-loader';

import LikeListComponents from '../components/LikeListComponents';
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {clearData, KEYS, getData, storeData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';

import {postsSelectors, postsOperations} from 'state/ducks/posts';

class likesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentLoading: true,
      likeData: [],
      showFormPopup: false,
      profileData: {},
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchLikes();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchLikes = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);
      const postId = this.props.navigation.getParam('postId', null);

      // if (userInfo) {
      const params = {
        postId,
      };

      // calling api
      await this.props.viewComments('Customers/viewLikes', params, true);
      const {isViewComments: response} = this.props;

      // // calling api
      // const response = await makeRequest(
      //   BASE_URL + 'Customers/viewLikes',
      //   params,
      //   true,
      // );

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
          const {loadMore, likes} = response;

          this.setState({
            likeData: likes,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          isListRefreshing: false,
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

  likeItem = ({item}) => (
    <LikeListComponents
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
      handlePopupShow={this.handleProfilePopup}
    />
  );

  handleProfilePopup = async item => {
    await this.setState({profileData: item});
    this.setState({showFormPopup: true});
  };
  closePopup = () => {
    this.setState({showFormPopup: false});
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {contentLoading, likeData, profileData} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Likes"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
        />
        {contentLoading === true ? (
          <View style={{flex: 1}}>
            <Bullets active listSize={10} loading={contentLoading} />
            {/* <FacebookLoader active loading={contentLoading} /> */}
          </View>
        ) : (
          <FlatList
            data={likeData}
            renderItem={this.likeItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {this.state.showFormPopup && (
          <CommentUserDetailScreen
            item={profileData}
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  commentPost: postsOperations.commentPost,
  viewComments: postsOperations.viewComments,
  reportOrBlock: postsOperations.reportOrBlock,
  viewLikes: postsOperations.viewLikes,
};

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isCommentPost: postsSelectors.isCommentPost(state),
  isReportOrBlock: postsSelectors.isReportOrBlock(state),
  isViewLikes: postsSelectors.isViewLikes(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(likesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 4,
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
});
