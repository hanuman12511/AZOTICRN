import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';

// Libraries
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';
import AddCommentListComponent from '../components/AddCommentListComponent';

// Styles
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {clearData} from 'state/utils/UserPreference';

import {FacebookLoader} from 'react-native-easy-content-loader';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class ViewLikesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentLoading: true,
      isProcessing: false,
      likes: null,
      comment: '',
      status: '',
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});
      const postId = this.props.navigation.getParam('postId', null);
      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        postId,
      };

      // calling api

      const response = await makeNetworkRequest(
        'Customers/viewLikes',
        params,
        true,
      );

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
          const {likes} = response;

          this.setState({
            likes,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message, isAuthTokenExpired} = response;

          this.setState({
            status: message,
            likes: null,
            contentLoading: false,
            isLoading: false,
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
            return;
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

  renderItem = ({item}) => (
    <AddCommentListComponent item={item} nav={this.props.navigation} />
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

  render() {
    const {contentLoading, likes, status} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Likes"
          nav={this.props.navigation}
          navAction="back"
        />

        <View style={basicStyles.mainContainer}>
          {contentLoading === true ? (
            <View>
              <FacebookLoader active loading={contentLoading} />
              <FacebookLoader active loading={contentLoading} />
              <FacebookLoader active loading={contentLoading} />
            </View>
          ) : (
            <View style={[basicStyles.flexOne, {height: hp(75)}]}>
              {likes ? (
                <FlatList
                  data={likes}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>{status}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: wp(0.5),
  },
  listContainer: {
    padding: wp(2),
  },

  multiLineInputDesign: {
    fontSize: wp(3),
    textAlignVertical: 'top',
    height: hp(10),
    margin: wp(2),
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: 5,
    padding: wp(2),
  },
  postButton: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    position: 'absolute',
    right: wp(4),
    bottom: wp(4),
    borderRadius: 5,
  },
});
