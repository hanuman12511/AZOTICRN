import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import RazorpayCheckout from 'react-native-razorpay';

// Components
import HeaderComponent from '../components/HeaderComponent';
import ProcessingLoader from '../components/ProcessingLoader';
import {showToast} from '../components/CustomToast';

// Styles
import BasicStyles from '../styles/BasicStyles';

// Icons
import ic_cod from '../assets/icons/ic_cod.png';
import ic_cards from '../assets/icons/ic_cards.png';

// Styles
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, clearData, getData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class PaymentScreen extends Component {
  constructor(props) {
    super(props);

    const info = props.navigation.getParam('info', null);

    const {total} = info;
    this.info = info;
    this.state = {
      total,
      paymentMode: null,
      isProcessing: false,
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

  handlePaymentMode = (payMode) => () => {
    this.setState({paymentMode: payMode});
  };

  handlePayment = async () => {
    const {paymentMode} = this.state;

    // Validations
    if (paymentMode === null) {
      Alert.alert('Alert!', 'Please select Payment Mode.', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    // Starting Loader
    this.setState({
      isProcessing: true,
    });

    try {
      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }
      let {address, total, promoCode, selectedSlot} = this.info;

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
        paymentMode,
        address,
        remainingPayableAmount: total,
        slotId: selectedSlot.id,
        deliveryDate: selectedSlot.date,
        promoCode,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/placeOrder',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {placed, onlinePaymentInfo, orderId} = response;

          if (placed === false) {
            const {
              onlineKeyId,
              onlineOrderId,
              currency,
              description,
              merchantName,
              merchantLogo,
            } = onlinePaymentInfo;

            const info = {
              orderId,
              orderAmount: total,
              onlineKeyId,
              onlineOrderId,
              currency,
              description,
              merchantName,
              merchantLogo,
              deviceId,
            };

            await this.handleOnlinePayment(info);
          } else {
            this.setState({
              isProcessing: false,
              isLoading: false,
            });
            // navigating
            this.props.navigation.navigate('ConfirmOrder', {response});
          }
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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('Login');
  };

  handleOnlinePayment = async (info) => {
    try {
      const {
        deviceId,
        orderId,
        orderAmount,
        onlineKeyId,
        onlineOrderId,
        currency,
        description,
        merchantName,
        merchantLogo,
      } = info;

      const options = {
        key: onlineKeyId,
        amount: `${orderAmount}`,
        currency: currency,
        name: merchantName,
        order_id: onlineOrderId,
        description: description,
        image: merchantLogo,
        theme: {color: '#0082c7'},
      };

      // transferring control to payment gateway
      const paymentGatewayResponse = await RazorpayCheckout.open(options);

      // processing payment gateway response
      if (paymentGatewayResponse) {
        const {
          razorpay_order_id: onlineOrderId,
          razorpay_payment_id: onlinePaymentId = null,
          razorpay_signature: onlineSignature = null,
        } = paymentGatewayResponse;

        // preparing params
        const params = {
          deviceId,
          orderId,
          onlineOrderId,
          onlinePaymentId,
          onlineSignature,
        };

        console.log('Params -=-=', params);

        // calling api
        const response = await makeRequest(
          BASE_URL + 'Customers/onlinePaymentVerification',
          params,
          true,
        );

        // processing response
        if (response) {
          const {success, message} = response;

          if (success) {
            // stopping loader
            this.setState({isProcessing: false});

            // navigating
            this.props.navigation.navigate('ConfirmOrder', {response});
            showToast(message);
          } else {
            this.setState({isProcessing: false});
          }
        } else {
          // stopping loader
          this.setState({isProcessing: false});
        }
      } else {
        // stopping loader
        this.setState({isProcessing: false});
      }
    } catch (error) {
      const {code, description} = error;

      // if (code === 0 && description === 'Payment Cancelled') {
      //   // stopping loader
      //   this.setState({isProcessing: false});
      // } else if (code === 2 && description === 'Payment cancelled by user') {
      //   // stopping loader
      //   this.setState({isProcessing: false});
      // } else {
      showToast(error.error.description);
      this.setState({isProcessing: false});
      // }
    }
  };

  render() {
    const {paymentMode, total, isProcessing} = this.state;

    const selectedModeStyle = {
      ...styles.optionList,
      color: '#F57C00',
      borderColor: '#F57C00',
    };
    return (
      <SafeAreaView
        style={[BasicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          navAction="back"
          nav={this.props.navigation}
          headerTitle="Payment Options"
        />

        <View style={[basicStyles.padding, basicStyles.flexOne]}>
          <View style={styles.totalAmountContainer}>
            <Text style={basicStyles.heading}>Payable Amount</Text>
            <Text style={[basicStyles.heading, {color: '#F57C00'}]}>
              ₹ {total}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              paymentMode === 'COD' ? selectedModeStyle : styles.optionList,
            ]}
            onPress={this.handlePaymentMode('COD')}>
            <Image
              source={ic_cod}
              resizeMode="cover"
              style={styles.paymentOptionIcon}
            />
            <Text style={basicStyles.text}>Cash on Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              paymentMode === 'ONLINE' ? selectedModeStyle : styles.optionList,
            ]}
            onPress={this.handlePaymentMode('ONLINE')}>
            <Image
              source={ic_cards}
              resizeMode="cover"
              style={styles.paymentOptionIcon}
            />
            <Text style={basicStyles.text}>Pay Online</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handlePayment}
            underlayColor="#F57C0080"
            style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  paymentList: {
    padding: wp(3),
    margin: wp(2),
    marginBottom: wp(0),
  },
  totalAmountContainer: {
    paddingBottom: wp(3),
    paddingTop: wp(0),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp(3),
    aspectRatio: 1 / 1,
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  optionList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    // paddingVertical: wp(3),
    height: hp(6),
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: wp(2),
    // borderRadius: 4,
  },
  paymentOptionIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  saveButton: {
    marginTop: wp(2),
    backgroundColor: '#F57C00',
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    // margin: wp(2),
  },
  saveButtonText: {
    fontSize: wp(3.7),
    color: '#fff',
    fontWeight: '700',
  },
});
