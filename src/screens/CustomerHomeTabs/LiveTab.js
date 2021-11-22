import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Libraries
import PickerModal from 'react-native-picker-modal-view';
import SafeAreaView from 'react-native-safe-area-view';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioForm from 'react-native-simple-radio-button';

// Components
import LiveTabComponent from '../../components/LiveTabComponent';
import LiveTabAgroComponent from '../../components/LiveTabAgroComponent';
import {showToast} from '../../components/CustomToast';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Images
import {InstagramLoader} from 'react-native-easy-content-loader';

// Icons
import ic_filter from '../../assets/icons/ic_filter.png';
import ic_search_black from '../../assets/icons/ic_search_black.png';
import sortHigh from '../../assets/icons/sortHigh.png';
import sortLow from '../../assets/icons/sortLow.png';
import ic_alphabetical_order from '../../assets/icons/ic_alphabetical_order.png';
import ic_alphabetical_order2 from '../../assets/icons/ic_alphabetical_order2.png';
import about_to_end from '../../assets/icons/about_to_end.png';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

// Redux
import {connect} from 'react-redux';
import {loaderSelectors} from 'state/ducks/loader';
import {
  vendorsFreshSelectors,
  vendorsFreshOperations,
} from 'state/ducks/vendorsFresh';

class LiveTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemCount: 0,
      contentLoading: true,
      foodProducts: null,
      agroProducts: null,
      keyword: '',
      orderType: 'Food',
      type: 'restaurant',
      initial: 0,

      selectedSortValue: '',
      sortIcon: ic_filter,

      showQualityPopup: false,
    };

    this.radio_props = [
      {label: 'Food', value: 'Food'},
      {label: 'Agro', value: 'Agro'},
    ];
  }

  componentDidMount() {
    this.fetchFoodProducts();
    this.fetchAgroProducts();
  }

  renderSortLayout = (disabled, selected, showModal) => {
    const {selectedSortValue} = this.state;

    const handlePress = disabled ? null : showModal;

    return (
      <TouchableOpacity
        onPress={handlePress}
        underlayColor="#F57C0080"
        style={styles.sortIcon}>
        <Material
          name="sort-ascending"
          color="#fff"
          size={21}
          style={styles.iconRow}
        />
      </TouchableOpacity>
    );
  };

  handleSelectedSortValue = (selectedSortValue, sortIcon) => async () => {
    await this.setState({selectedSortValue, sortIcon});
    this.handleFilter();
    await this.fetchFoodProducts();
    await this.fetchAgroProducts();
    // return selectedSortValue;
  };

  handleSelectedSortValueClose = () => {
    const {selectedSortValue} = this.state;
    this.setState({selectedSortValue});
  };

  backAction = async () => {
    try {
      this.props.navigation.navigate('NewsNav');
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchFoodProducts = async () => {
    const {selectedSortValue} = this.state;

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
        sortingValue: selectedSortValue,
        deviceId,
      };

      if (userInfo) {
        const {payloadId} = userInfo;
        params = {
          payloadId,
          sortingValue: selectedSortValue,
          deviceId,
        };
      }

      // calling api
      await this.props.liveProducts('Customers/liveProducts', params);
      const {isLiveProducts: response} = this.props;

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
          const {liveProducts: foodProducts} = response;

          this.setState({
            foodProducts,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            foodProducts: null,
            isLoading: false,
            contentLoading: false,
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

  fetchAgroProducts = async () => {
    const {selectedSortValue} = this.state;

    try {
      // starting loader
      this.setState({contentLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      const {deviceId} = deviceInfo;

      // Preparing Params
      let params = {
        sortingValue: selectedSortValue,
        deviceId,
      };

      if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          payloadId,
          sortingValue: selectedSortValue,
          deviceId,
        };
      }

      // Calling API
      await this.props.liveFarmProducts('Customers/liveFarmProducts', params);
      const {isLiveFarmProducts: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {liveProducts: agroProducts} = response;

          this.setState({
            agroProducts,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            agroProducts: null,
            isLoading: false,
            contentLoading: false,
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

  handleSearchProducts = async () => {
    const {keyword, type: searchType} = this.state;

    try {
      // starting loader
      this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      let payloadId = null;
      if (userInfo) {
        const {payloadId: payId} = userInfo;
        payloadId = payId;
      }

      let params = {
        deviceId,
        keyword,
        payloadId,
        type: searchType,
      };

      // Calling API
      await this.props.searchProducts('Customers/searchProduct', params);
      const {isSearchProducts: response} = this.props;

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          let {liveProducts} = response;
          let foodProducts = null;
          let agroProducts = null;
          if (searchType === 'restaurant') {
            foodProducts = liveProducts;
          } else if (searchType === 'farm') {
            agroProducts = liveProducts;
          }

          this.setState({
            foodProducts,
            agroProducts,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message, liveProducts} = response;

          let foodProducts = null;
          let agroProducts = null;

          if (searchType === 'restaurant') {
            foodProducts = liveProducts;
          } else if (searchType === 'farm') {
            agroProducts = liveProducts;
          }

          this.setState({
            status: message,
            foodProducts,
            agroProducts,
            isLoading: false,
            contentLoading: false,
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
    <LiveTabComponent
      item={item}
      nav={this.props.navigation}
      fetchCartCount={this.fetchCartCount}
    />
  );

  renderItem2 = ({item}) => (
    <LiveTabAgroComponent
      item={item}
      nav={this.props.navigation}
      fetchCartCount={this.fetchCartCount}
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

  handleMobile = async changedText => {
    await this.setState({keyword: changedText});
    await this.handleSearchProducts();
  };

  handleSelectGender = async value => {
    let initial = value === 'Agro' ? 1 : 0;

    this.setState({orderType: value, initial: initial});

    if (value === 'Food') {
      this.setState({type: 'restaurant', keyword: ''});

      await this.fetchFoodProducts();
    } else if (value === 'Agro') {
      this.setState({type: 'farm', keyword: ''});

      await this.fetchAgroProducts();
    }
  };

  handleFilter = () => {
    this.setState(prevState => ({
      showFilters: !prevState.showFilters,
    }));
  };

  render() {
    const {
      foodProducts,
      agroProducts,
      contentLoading,

      orderType,
      sortIcon,
      showFilters,
    } = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        {contentLoading === true ? (
          <View style={{flex: 1}}>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        ) : (
          <View
            style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyEnd,
                basicStyles.padding,
                basicStyles.alignCenter,
                styles.filters,
              ]}>
              <View style={[styles.inputView]}>
                <Image
                  source={ic_search_black}
                  resizeMode="cover"
                  style={basicStyles.iconRow}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search"
                  placeholderTextColor="#999"
                  value={this.state.keyword}
                  onChangeText={this.handleMobile}
                />
              </View>

              <TouchableOpacity
                onPress={this.handleFilter}
                style={styles.filterIcon}
                underlayColor="#ccc">
                <Image
                  source={sortIcon}
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
                  onPress={this.handleSelectedSortValue('', ic_filter)}>
                  <Image
                    source={ic_filter}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Default
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue('priceHigh', sortLow)}>
                  <Image
                    source={sortLow}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Price High to Low
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue('priceLow', sortHigh)}>
                  <Image
                    source={sortHigh}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    Price Low to High
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[basicStyles.directionRow, basicStyles.paddingBottom]}
                  onPress={this.handleSelectedSortValue(
                    'alphaIncreasing',
                    ic_alphabetical_order,
                  )}>
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
                  onPress={this.handleSelectedSortValue(
                    'alphaDecreasing',
                    ic_alphabetical_order2,
                  )}>
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
                  onPress={this.handleSelectedSortValue(
                    'aboutEnd',
                    about_to_end,
                  )}>
                  <Image
                    source={about_to_end}
                    resizeMode="cover"
                    style={styles.filterIcons}
                  />
                  <Text style={[basicStyles.flexOne, basicStyles.text]}>
                    About to End
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.text, basicStyles.paddingHorizontal]}>
              Showing items in the category
            </Text>

            <RadioForm
              radio_props={this.radio_props}
              initial={this.state.initial}
              onPress={this.handleSelectGender}
              buttonSize={0}
              buttonOuterSize={20}
              buttonInnerColor={'#fff'}
              buttonColor={'#f2f1f1'}
              selectedButtonColor={'#F57C00'}
              labelColor={'#f2f1f1'}
              labelStyle={styles.radioButtonLabel}
              style={styles.radioButton}
            />

            {orderType === 'Food' ? (
              <View style={[basicStyles.flexOne, styles.flatListContainer]}>
                {foodProducts ? (
                  <View style={styles.flatContainer}>
                    <FlatList
                      data={foodProducts}
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
                    <Text
                      style={[
                        basicStyles.noDataTextStyle,
                        basicStyles.graysColor2,
                        basicStyles.textBold,
                      ]}>
                      No product available.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={basicStyles.flexOne}>
                {agroProducts ? (
                  <View style={styles.flatContainer}>
                    <FlatList
                      data={agroProducts}
                      renderItem={this.renderItem2}
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
                    <Text
                      style={[
                        basicStyles.noDataTextStyle,
                        basicStyles.graysColor2,
                        basicStyles.textBold,
                      ]}>
                      No product available.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {
  liveProducts: vendorsFreshOperations.liveProducts,
  liveFarmProducts: vendorsFreshOperations.liveFarmProducts,
  searchProducts: vendorsFreshOperations.searchProducts,
};

const mapStateToProps = state => ({
  isProcessing: loaderSelectors.isProcessing(state),
  isLiveProducts: vendorsFreshSelectors.isLiveProducts(state),
  isLiveFarmProducts: vendorsFreshSelectors.isLiveFarmProducts(state),
  isSearchProducts: vendorsFreshSelectors.isSearchProducts(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveTab);

const styles = StyleSheet.create({
  sortIcon: {
    backgroundColor: '#f65e83',
    height: hp(4),
    width: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
  },
  flatListContainer: {
    borderTopWidth: 4,
    borderTopColor: '#ccc4',
  },
  text: {
    fontSize: wp(4),
    color: '#999',
    fontWeight: '700',
  },
  filters: {
    // marginHorizontal: wp(2),
    // borderTopWidth: 1,
    // borderTopColor: '#cccccc90',
    paddingTop: 0,
  },

  filterIcon: {
    backgroundColor: '#fff',
    height: hp(4.8),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: wp(3),
    borderWidth: 1,
    borderColor: '#ccc',
  },

  fIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },

  filterBox: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
  },

  flatContainer: {
    flex: 1,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },

  topOptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(212, 175, 55, .15)',
  },

  topOptionColor1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(212, 175, 55, .15)',
  },

  topOptionColor2: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(49, 137, 86, .1)',
  },

  topOptionColor3: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(133, 58, 119, .1)',
  },

  topOptionColor4: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    marginHorizontal: wp(1),
    backgroundColor: 'rgba(0, 0, 0, .05)',
  },

  topOptionImg: {
    height: wp(10),
    aspectRatio: 1 / 1,
    // borderRadius: wp(10),
    marginVertical: hp(0.5),
  },

  screenInfoTitle: {
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: wp(1),
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
  inputView: {
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
  input: {
    flex: 1,
    fontSize: wp(3.5),
    color: '#333',
    padding: wp(0.5),
  },

  separator: {
    height: 4,
    backgroundColor: '#ccc4',
  },
  listContainer: {
    padding: wp(0),
    marginTop: 4,
  },
  radioButtonLabel: {
    fontSize: wp(4),
    color: '#777',
    marginLeft: wp(1),
    marginRight: wp(5),
    fontWeight: '700',
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: wp(5),
    marginVertical: hp(1),
  },
  pickerContainer: {
    // height: hp(8),
    // borderWidth: 1,
    // borderColor: '#00000030',
    // marginBottom: hp(2),
  },

  pickerDesign: {
    height: hp(6),
    color: '#00000080',
  },
  filterIcons: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
});
