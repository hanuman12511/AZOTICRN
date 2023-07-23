import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import {showToast} from '../components/CustomToast';
import StepIndicator from 'react-native-step-indicator';

// Styles
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {clearData} from 'state/utils/UserPreference';

// API

import {FacebookLoader} from 'react-native-easy-content-loader';

// Images
import ic_order from '../assets/icons/ic_order.png';
import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);
    let currentPosition = 2;

    const item = props.navigation.getParam('item', null);

    const {
      orderId,
      orderStatus,
      vendorName,
      vendorContact,
      vendorImage,
      orderTotal,
      selectedSlot,
      placedDate,
      deliveryDate,
      deliveryCharge,
      orderedItem,
    } = item;

    if (orderStatus === null || orderStatus === 'orderPending') {
      currentPosition = 0;
    } else if (orderStatus === 'orderInKitchen') {
      currentPosition = 1;
    } else if (orderStatus === 'orderReadyForDelivery') {
      currentPosition = 2;
    } else if (orderStatus === 'orderOutForDelivery') {
      currentPosition = 3;
    } else if (orderStatus === 'orderDelivered') {
      currentPosition = 4;
    }

    this.state = {
      currentPosition,
      labels: [
        'Order Pending',
        'Order In Kitchen',
        'Order Ready For Delivery',
        'Order Out For Delivery',
      ],
      orderedItem,
      orderId,
      orderStatus,
      vendorName,
      vendorContact,
      vendorImage,
      orderTotal,
      selectedSlot,
      placedDate,
      deliveryDate,
      deliveryCharge,
      contentLoading: false,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchViewOrders = async () => {
    try {
      // starting loader
      this.setState({contentLoading: true});
      const item = this.props.navigation.getParam('item', null);

      if (!item) {
        return;
      }
      const {orderId, status} = item;

      const params = {
        orderId,
        status: JSON.stringify(status),
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/viewOrderDetails',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({
            isLoading: false,
            isProcessing: false,
            contentLoading: false,
            isListRefreshing: false,
          });

          const {output} = response;

          this.setState({
            // output,
            status: null,
            contentLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            status: message,
            // output: null,
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

  // renderItem = ({item}) => {
  //   const {productId, productName, quantity, rate, totalAmount, image} = item;
  //   return (
  //     <View
  //       style={[
  //         basicStyles.directionRow,
  //         basicStyles.justifyBetween,
  //         basicStyles.paddingHalfBottom,
  //       ]}>
  //       <Text style={[basicStyles.heading, styles.title]}>{productName}</Text>
  //       <Text style={[basicStyles.grayColor, styles.quantity]}>
  //         ({quantity}x{rate})
  //       </Text>
  //       <Text style={[basicStyles.heading, styles.price]}>
  //         Rs. {totalAmount}
  //       </Text>
  //     </View>
  //   );
  // };

  renderItem = ({item}) => {
    const {productId, productName, quantity, rate, totalAmount, image} = item;
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          basicStyles.paddingHalfBottom,
        ]}>
        <Text style={[basicStyles.heading, styles.title]}>{productName}</Text>
        <Text style={[basicStyles.grayColor, styles.quantity]}>
          ({quantity}x{rate})
        </Text>
        <Text style={[basicStyles.heading, styles.price]}>
          Rs. {totalAmount}
        </Text>
      </View>
    );
  };

  // renderItem = ({item}) => {
  //   const {productId, productName, quantity, rate, totalAmount, image} = item;
  //   return (
  //     <View>
  //       <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
  //         <View style={basicStyles.flexOne}>
  //           <Text style={basicStyles.heading}>{productName}</Text>
  //           <Text
  //             style={[
  //               basicStyles.text,
  //               basicStyles.grayColor,
  //               basicStyles.paddingHalfVertical,
  //             ]}>
  //             Qty: {quantity}
  //           </Text>
  //           <Text
  //             style={[
  //               basicStyles.text,
  //               basicStyles.grayColor,
  //               basicStyles.paddingHalfBottom,
  //             ]}>
  //             Chicken has to grilled not fried Rice needs to flaky. Flavours
  //             need to bevirant.
  //           </Text>
  //         </View>
  //         <Image
  //           source={{uri: image}}
  //           resizeMode="cover"
  //           style={styles.imageStyle}
  //         />
  //       </View>

  //       <View style={basicStyles.separatorHorizontalLight} />

  //       <View
  //         style={[
  //           basicStyles.directionRow,
  //           basicStyles.justifyBetween,
  //           basicStyles.paddingHalfBottom,
  //         ]}>
  //         <Text style={basicStyles.headingSmall}>Rate ()</Text>
  //         <Text style={basicStyles.headingSmall}>Rs. {rate}</Text>
  //       </View>
  //       <View
  //         style={[
  //           basicStyles.directionRow,
  //           basicStyles.justifyBetween,
  //           basicStyles.paddingHalfBottom,
  //         ]}>
  //         <Text style={basicStyles.headingSmall}>Full Price</Text>
  //         <Text style={basicStyles.headingSmall}>Rs. {totalAmount}</Text>
  //       </View>
  //     </View>
  //   );
  // };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleSort = () => {};
  handleFilter = () => {};

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
    const {
      contentLoading,
      labels,
      orderId,
      orderStatus,
      vendorName,
      vendorContact,
      vendorImage,
      orderTotal,
      selectedSlot,
      placedDate,
      deliveryDate,
      deliveryCharge,
      orderedItem,
    } = this.state;

    // if (contentLoading) {
    //   return <CustomLoader />;
    // }

    const customStyles = {
      stepIndicatorSize: 30,
      currentStepIndicatorSize: 40,
      separatorStrokeWidth: 3,
      currentStepStrokeWidth: 5,
      stepStrokeCurrentColor: '#fe7013',
      separatorFinishedColor: '#fe7013',
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#fe7013',
      stepIndicatorUnFinishedColor: '#aaaaaa',
      stepIndicatorCurrentColor: '#ffffff',
      stepIndicatorLabelFontSize: 15,
      currentStepIndicatorLabelFontSize: 15,
      stepIndicatorLabelCurrentColor: '#000000',
      stepIndicatorLabelFinishedColor: '#ffffff',
      stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
      labelColor: '#666666',
      labelSize: 15,
      labelAlign: 'flex-start',
      currentStepLabelColor: '#fe7013',
    };

    return (
      <SafeAreaView style={basicStyles.container}>
        <HeaderComponent
          navAction="back"
          headerTitle="Track Order"
          nav={this.props.navigation}
        />

        {contentLoading === true ? (
          <View>
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
            <FacebookLoader active loading={contentLoading} />
          </View>
        ) : (
          <ScrollView>
            {orderedItem ? (
              <View style={basicStyles.flexOne}>
                <View style={styles.cartTopDetail}>
                  {/* <TouchableOpacity>
                    <Text>Cancel This Order</Text>
                  </TouchableOpacity> */}

                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.justifyBetween,
                      basicStyles.paddingHalfBottom,
                    ]}>
                    <View
                      style={[
                        basicStyles.directionRow,
                        basicStyles.alignCenter,
                      ]}>
                      <View style={styles.iconContainer}>
                        <Image
                          source={ic_order}
                          resizeMode="cover"
                          style={styles.orderIcon}
                        />
                      </View>
                      <Text
                        style={[basicStyles.textSmall, basicStyles.grayColor]}>
                        Order ID : {orderId}
                      </Text>
                    </View>
                    <Text
                      style={[basicStyles.textSmall, basicStyles.grayColor]}>
                      {placedDate}
                    </Text>
                  </View>

                  <View style={basicStyles.separatorHorizontalLight} />

                  <Text
                    style={[
                      basicStyles.text,
                      basicStyles.grayColor,
                      basicStyles.paddingHalfBottom,
                    ]}>
                    Selected Slot:{' '}
                    <Text style={[basicStyles.headingSmall]}>
                      {selectedSlot.slot}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      basicStyles.text,
                      basicStyles.grayColor,
                      basicStyles.paddingHalfBottom,
                    ]}>
                    Ordered form:{' '}
                    <Text style={[basicStyles.heading]}>{vendorName}</Text>
                  </Text>

                  <FlatList
                    data={orderedItem}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                    refreshing={this.state.isListRefreshing}
                    onRefresh={this.handleListRefresh}
                  />

                  {/* <View
                    style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                    <View style={basicStyles.flexOne}>
                      <Text style={basicStyles.heading}>Pindi Chhole</Text>
                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.grayColor,
                          basicStyles.paddingHalfVertical,
                        ]}>
                        Qty: 2
                      </Text>
                      <Text
                        style={[
                          basicStyles.text,
                          basicStyles.grayColor,
                          basicStyles.paddingHalfBottom,
                        ]}>
                        Chicken has to grilled not fried Rice needs to flaky.
                        Flavours need to bevirant.
                      </Text>
                    </View>
                    <Image
                      source={product}
                      resizeMode="cover"
                      style={styles.imageStyle}
                    />
                  </View> */}

                  <View style={basicStyles.separatorHorizontalLight} />

                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.justifyBetween,
                      // basicStyles.paddingHalfBottom,
                    ]}>
                    <Text style={basicStyles.heading}>Total</Text>
                    <Text style={basicStyles.heading}>Rs. {orderTotal}</Text>
                  </View>
                </View>

                <View style={styles.orderStatusContainer}>
                  <Text
                    style={[
                      basicStyles.headingLarge,
                      basicStyles.marginBottomHalf,
                    ]}>
                    Order Status
                  </Text>

                  <View style={{flex: 1, padding: wp(2)}}>
                    <StepIndicator
                      customStyles={customStyles}
                      stepCount={4}
                      direction="vertical"
                      currentPosition={this.state.currentPosition}
                      labels={labels}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={basicStyles.noDataStyle}>
                <Text style={basicStyles.noDataTextStyle}>No Order Found.</Text>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
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
    // // marginHorizontal: wp(2),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    // elevation: 5,
    margin: wp(1),
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
    height: wp(2),
  },
  listContainer: {
    margin: hp(1),
  },

  cartTopDetail: {
    margin: wp(1),
    backgroundColor: '#fff',
    padding: wp(2),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp(1),
  },
  rowSeparator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: wp(1),
  },
  rowColumn: {
    fontSize: wp(3.4),
    fontWeight: '700',
  },
  rowColumn2: {
    fontSize: wp(3.4),
    textTransform: 'capitalize',
  },
  heading: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginBottom: hp(2.2),
  },
  description: {
    marginTop: hp(0.5),
  },
  imageStyle: {
    width: wp(22),
    aspectRatio: 1 / 1,
    borderRadius: 10,
    marginLeft: wp(2),
  },
  orderStatusContainer: {
    height: hp(50),

    backgroundColor: '#fff',
    padding: wp(3),
    marginTop: wp(1),
  },
  checkIcon: {
    backgroundColor: '#43a04720',
    borderWidth: 1,
    borderColor: '#43a04740',
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  infoOrangeIcon: {
    backgroundColor: '#ff900020',
    borderWidth: 1,
    borderColor: '#ff900040',
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  checkIconGray: {
    backgroundColor: '#cccccc20',
    borderWidth: 1,
    borderColor: '#cccccc40',
    height: wp(12),
    width: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  statusIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  iconContainer: {
    backgroundColor: '#ff900040',
    width: wp(7),
    height: wp(7),
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  orderIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
});
