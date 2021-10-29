import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import OrderCancelledTabComponent from '../components/OrderCancelledTabComponent';
import {showToast} from '../components/CustomToast';

// Styles
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {clearData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

import {FacebookLoader} from 'react-native-easy-content-loader';

export default class OrderCancelledTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ordersInfo: null,
      contentLoading: true,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchViewOrders();
  }

  fetchViewOrders = async () => {
    try {
      // starting loader
      this.setState({contentLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);

      // if (userInfo) {
      const params = {
        status: JSON.stringify(['cancelled']),
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/viewOrders',
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

        const {success, message} = response;

        if (success) {
          const {ordersInfo} = response;

          this.setState({
            ordersInfo,
            status: null,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            status: message,
            ordersInfo: null,
            contentLoading: false,
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
        }
      } else {
        this.setState({
          isProcessing: false,
          contentLoading: false,
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
    <OrderCancelledTabComponent item={item} nav={this.props.navigation} />
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
    const {contentLoading, ordersInfo} = this.state;
    return (
      <View style={basicStyles.container}>
        {contentLoading === true ? (
          <View>
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
          </View>
        ) : (
          <View style={basicStyles.flexOne}>
            {ordersInfo ? (
              <View style={styles.flatContainer}>
                <FlatList
                  data={ordersInfo}
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
              <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                <Text style={basicStyles.noDataTextStyle}>No Order Found.</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sortIcon: {
    backgroundColor: '#31895120',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },

  filters: {
    marginHorizontal: wp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#cccccc80',
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
    // backgroundColor: 'rgba( 0, 0, 0, 0.9 )',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // elevation: 5,
  },
  topOptionImg: {
    height: wp(15),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    marginVertical: hp(0.5),
  },
  screenInfo: {
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp(20),
    marginHorizontal: wp(1),
  },
  screenInfoTitle: {
    color: '#333',
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
    backgroundColor: '#333',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: {
    height: wp(1.5),
    backgroundColor: '#ccc4',
  },
});
