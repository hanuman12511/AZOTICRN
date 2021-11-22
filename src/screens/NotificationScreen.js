import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, BackHandler} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import NotificationComponent from '../components/NotificationCOmponent';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

// Styles
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {getData, storeData, KEYS} from 'state/utils/UserPreference';

// API

import {
  ContentLoader,
  FacebookLoader,
  InstagramLoader,
} from 'react-native-easy-content-loader';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {homeSelectors, homeOperations} from 'state/ducks/home';

class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      output: null,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    this.fetchNotification();
    // this.resetNotificationCount();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = async () => {
    this.props.navigation.pop();
  };

  fetchNotification = async () => {
    try {
      // starting loader
      // this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);

      let params = null;

      if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
        };
      }

      await this.props.notificationList(
        'Notifications/notificationList',
        params,
        true,
      );

      const {isNotificationList: response} = this.props;

      // Processing Response
      if (response) {
        // this.setState({
        //   isLoading: false,
        //   isProcessing: false,
        //   contentLoading: false,
        //   isListRefreshing: false,
        // });

        const {success} = response;
        if (success) {
          const {output} = response;

          this.setState({
            output,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
          await this.resetNotificationCount();
        } else {
          const {message} = response;

          this.setState({
            status: message,
            output: null,
            contentLoading: false,
            isLoading: false,
            isListRefreshing: false,
          });
          await this.resetNotificationCount();
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

        await this.props.getNotificationCount(
          'Notifications/getNotificationCount',
          params,
          true,
        );

        const {isGetNotificationCount: response} = this.props;

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

  resetNotificationCount = async () => {
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
        await this.props.resetNotificationCount(
          'Notifications/resetNotificationCount',
          params,
          true,
        );

        const {isResetNotificationCount: response} = this.props;

        // processing response
        if (response) {
          this.setState({
            isLoading: false,
          });
          await this.fetchNotificationCount();
        } else {
          this.setState({
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <NotificationComponent item={item} nav={this.props.navigation} />
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
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    const {output} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          navAction="back"
          showAccountIcon
          showCartIcon
          nav={this.props.navigation}
          headerTitle="Notification"
          // showHeaderLogo
        />
        {output ? (
          <View style={basicStyles.mainContainer}>
            <FlatList
              data={this.state.output}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>
              Notification Box Empty.
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isGetNotificationCount: homeSelectors.isGetNotificationCount(state),
  isNotificationList: homeSelectors.isNotificationList(state),
  isResetNotificationCount: homeSelectors.isResetNotificationCount(state),
});

const mapDispatchToProps = {
  getNotificationCount: homeOperations.getNotificationCount,
  notificationList: homeOperations.notificationList,
  resetNotificationCount: homeOperations.resetNotificationCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);

const styles = StyleSheet.create({
  separator: {
    height: 4,
  },
  listContainer: {
    padding: wp(4),
  },
});
