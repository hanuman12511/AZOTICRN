import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import VendorRecommendationComponent from '../components/VendorRecommendationComponent';
import {showToast} from '../components/CustomToast';

// Style
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

import {InstagramLoader} from 'react-native-easy-content-loader';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class likesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followStatus: false,
      vendorList: null,
      contentLoading: true,
      isFollowed: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchRecommendation();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchRecommendation = async () => {
    try {
      // starting loader
      // this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);

      if (userInfo) {
        const {payloadId} = userInfo;
        const params = {
          payloadId,
        };

        // calling api
        const response = await makeNetworkRequest(
          'Customers/vendorRecommendation',
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

          const {success, isFollowed} = response;

          if (success) {
            const {data} = response;

            this.setState({
              isFollowed,
              vendorList: data,
              isLoading: false,
              isListRefreshing: false,
            });
          }
        } else {
          this.setState({
            data: null,
            isProcessing: false,
            isLoading: false,
            isListRefreshing: false,
          });

          showToast('Network Request Error...');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleFollowVendor = async (vendorId, followStatus) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        vendorId,
        follow: followStatus,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/followVendor',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});
        if (success) {
          await this.fetchRecommendation();

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

  likeItem = ({item}) => (
    <VendorRecommendationComponent
      item={item}
      nav={this.props.navigation}
      handleFollowVendor={this.handleFollowVendor}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleProceed = () => {
    if (this.state.isFollowed === false) {
      showToast('Please Follow Some Vendors To Get Started');
      return;
    }
    this.props.navigation.navigate('Home');
  };

  render() {
    const {contentLoading} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        {/* <HeaderComponent
          headerTitle="Vendor Recommendation"
          nav={this.props.navigation}
          navAction="back"
        /> */}
        <ScrollView>
          <View
            style={[
              basicStyles.paddingHorizontal,
              basicStyles.paddingTop,
              basicStyles.marginBottomHalf,
            ]}>
            <Text
              style={[basicStyles.headingXLarge, basicStyles.marginBottomHalf]}>
              Vendor Recommendation
            </Text>
            <Text style={[basicStyles.textLarge]}>
              Let’s get started with our most popular vendors
            </Text>
          </View>

          {contentLoading === true ? (
            <View style={{flex: 1}}>
              <InstagramLoader active loading={contentLoading} />
              <InstagramLoader active loading={contentLoading} />
            </View>
          ) : (
            <View>
              <FlatList
                data={this.state.vendorList}
                renderItem={this.likeItem}
                keyExtractor={this.keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
        </ScrollView>
        <TouchableOpacity
          onPress={this.handleProceed}
          style={[
            basicStyles.orangeBgColor,
            basicStyles.button,
            styles.signUpButton,
          ]}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Proceed
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 4,
  },
  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
});
