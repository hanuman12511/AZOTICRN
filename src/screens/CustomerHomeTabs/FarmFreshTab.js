import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import FreshTabComponent from '../../components/FreshTabComponent';
import {showToast} from '../../components/CustomToast';
import ProcessingLoader from '../../components/ProcessingLoader';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Images
import ic_filter from '../../assets/icons/ic_filter.png';
import ic_search_black from '../../assets/icons/ic_search_black.png';
import sortHigh from '../../assets/icons/sortHigh.png';
import sortLow from '../../assets/icons/sortLow.png';
import ic_alphabetical_order from '../../assets/icons/ic_alphabetical_order.png';
import ic_alphabetical_order2 from '../../assets/icons/ic_alphabetical_order2.png';
import about_to_end from '../../assets/icons/about_to_end.png';

// UserPreference
import {KEYS, clearData, getData} from '../../api/UserPreference';

import {InstagramLoader} from 'react-native-easy-content-loader';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {
  vendorsFreshSelectors,
  vendorsFreshOperations,
} from 'state/ducks/vendorsFresh';

class FarmFreshTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      vendors: null,
      contentLoading: true,
      loadMore: false,
      offset: 0,
      canLoad: true,
      isProcessing: false,
      sortingValue: '',
    };
  }

  componentDidMount() {
    this.fetchFoodVendors();
    // this.props.fetchStories();
  }

  backAction = async () => {
    try {
      this.props.navigation.navigate('NewsNav');
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchFoodVendors = async () => {
    const {vendors: oldVendors, offset, sortingValue} = this.state;
    try {
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }
      // starting loader
      this.setState({contentLoading: true});

      const {deviceId} = deviceInfo;

      const userInfo = await getData(KEYS.USER_INFO);

      let params = {
        deviceId,
        sortingValue,
      };

      if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          offset,
          sortingValue,
          deviceId,
        };
      }

      // Calling API
      await this.props.getFarmVendorList('Customers/getFarmVendorList', params);
      const {isGetFarmVendorList: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {vendors, loadMore} = response;

          if (loadMore === false) {
            this.setState({canLoad: false});
            return;
          }

          let newVendors = vendors;
          if (oldVendors !== null && offset !== 0) {
            oldVendors.push(...vendors);
            newVendors = oldVendors;
          }

          await this.setState({
            vendors: newVendors,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
            isProcessing: false,
            sortingValue: '',
          });
          // this.setState({
          //   isLoading: false,
          //   isProcessing: false,
          //   contentLoading: false,
          //   isListRefreshing: false,
          // });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            vendors: null,
            contentLoading: false,
            isLoading: false,
            isListRefreshing: false,
            sortingValue: '',
          });
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

  handleFollowVendor = async (vendorId, followStatus) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        vendorId,
        follow: followStatus,
      };

      // Calling API
      await this.props.followVendor('Customers/followVendor', params, true);
      const {isFollowVendor: response} = this.props;

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});
        if (success) {
          const {follow} = response;

          await this.fetchFoodVendors();

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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };

  handleSearchProducts = async () => {
    const {keyword} = this.state;

    try {
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const userInfo = await getData(KEYS.USER_INFO);

      let params = {
        offset: 0,
        keyword,
        deviceId,
      };

      if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          offset: 0,
          keyword,
          deviceId,
        };
      }

      // Calling API
      await this.props.getFarmVendorList('Customers/getFarmVendorList', params);
      const {isGetFarmVendorList: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {vendors} = response;

          this.setState({
            vendors,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            vendors: null,
            contentLoading: false,
            isLoading: false,
            isListRefreshing: false,
          });
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

  renderItem = ({item}) => (
    <FreshTabComponent
      item={item}
      nav={this.props.navigation}
      handleFollowVendor={this.handleFollowVendor}
      fetchCartCount={this.fetchCartCount}
      fetchFoodVendors={this.fetchFoodVendors}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true}, this.componentDidMount);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMobile = async changedText => {
    this.setState({keyword: changedText}, this.handleSearchProducts);
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
    let {offset, canLoad, vendors} = this.state;
    if (vendors.length < 15) {
      return;
    }
    try {
      if (canLoad) {
        var offs = ++offset;
        await this.setState({offset: offs});

        await this.fetchFoodVendors(); // method for API call
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleFilter = () => {
    this.setState(prevState => ({
      showFilters: !prevState.showFilters,
    }));
  };

  handleSelectedSortValue = sortingValue => async () => {
    await this.setState({sortingValue});
    this.handleFilter();
    await this.fetchFoodVendors();

    // return selectedSortValue;
  };

  render() {
    const {contentLoading, vendors, showFilters} = this.state;
    return (
      <SafeAreaView style={[basicStyles.container]}>
        {/* <HeaderComponent
          showHeaderLogo
          nav={this.props.navigation}
          showCartIcon
          showAccountIcon
        /> */}
        {contentLoading === true ? (
          <View style={{flex: 1}}>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        ) : (
          <View style={[styles.container]}>
            {/* <View style={[styles.filters]}>
              <Text style={[basicStyles.heading, {fontSize: wp(4)}]}>
                Fresh From Farm
              </Text>
            </View> */}

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyEnd,
                basicStyles.alignCenter,
                styles.filters,
              ]}>
              <View style={[styles.inputViews]}>
                <Image
                  source={ic_search_black}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search"
                  placeholderTextColor="#333"
                  value={this.state.keyword}
                  onChangeText={this.handleMobile}
                />
              </View>

              <TouchableOpacity
                onPress={this.handleFilter}
                style={styles.filterIcon}
                underlayColor="#ccc">
                <Image
                  source={ic_filter}
                  resizeMode="cover"
                  style={styles.fIcon}
                />
              </TouchableOpacity>
            </View>

            {showFilters && (
              <View style={styles.filterBox}>
                <Text style={[basicStyles.heading, basicStyles.paddingBottom]}>
                  Sort By
                </Text>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue('alphaIncreasing')}>
                  <Image
                    source={ic_alphabetical_order}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Alphabetical (A to Z)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue('alphaDecreasing')}>
                  <Image
                    source={ic_alphabetical_order2}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Alphabetical (Z to A)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue('popular')}>
                  <Image
                    source={about_to_end}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Popular
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {vendors ? (
              <View style={styles.flatContainer}>
                <FlatList
                  data={vendors}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                  ListFooterComponent={this.renderFooter.bind(this)}
                  onEndReachedThreshold={0.2}
                  onEndReached={this.handleLoadMore.bind(this)}
                />
              </View>
            ) : (
              <View style={basicStyles.noDataStyle}>
                <Text style={basicStyles.noDataTextStyle}>
                  No Farms Available.
                </Text>
              </View>
            )}
            {this.state.isProcessing && <ProcessingLoader />}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  getFarmVendorList: vendorsFreshOperations.getFarmVendorList,
  followVendor: vendorsFreshOperations.followVendor,
};

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isGetFarmVendorList: vendorsFreshSelectors.isGetFarmVendorList(state),
  isFollowVendor: vendorsFreshSelectors.isFollowVendor(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(FarmFreshTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  filters: {
    marginLeft: wp(2),
    // marginTop: hp(1),
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
    // borderColor: '#cccccc90',
    marginHorizontal: wp(2),
    // paddingBottom: hp(1),
    marginTop: hp(1),
  },
  inputViews: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    // borderWidth: 1.5,
    // borderColor: '#ddd',
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
    backgroundColor: '#fafafa',
    height: hp(5),
  },

  sortIcon: {
    backgroundColor: '#f65e83',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
  },

  filterIcons: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },

  fIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },

  flatContainer: {
    flex: 1,
  },

  filterBox: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
  },

  filterIcon: {
    backgroundColor: '#fff',
    height: hp(5),
    width: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
    borderWidth: 1,
    borderColor: '#ccc',
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
    height: 4,
    backgroundColor: '#ccc4',
  },
  listContainer: {
    // padding: wp(2),
  },
  vectorIconRow: {
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    alignSelf: 'flex-end',
  },
  inputView: {
    // alignItems: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
  },
  input: {
    flex: 1,
    fontSize: wp(3.2),
    padding: wp(0.5),
  },
});
