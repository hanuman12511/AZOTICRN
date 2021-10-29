import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';
import PromoCodeListComponent from '../components/PromoCodeListComponent';

import CustomLoader from '../components/CustomLoader';
import ProcessingLoader from '../components/ProcessingLoader';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class CouponScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isProcessing: false,
      coupons: null,
      status: null,
      selectedRadioButtonIndex: -1,
      promoCode: '',
      promoCodeId: null,
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.fetchCoupons();
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  fetchCoupons = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      const {payloadId} = userInfo;

      const params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/promoCodeList',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;
        this.setState({
          isLoading: false,
          isProcessing: false,
          contentLoading: false,
          isListRefreshing: false,
        });

        if (success) {
          const {output: coupons} = response;
          this.setState({coupons, status: null});
        } else {
          const {message: status} = response;
          this.setState({status, coupons: null, isLoading: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePromoCodeChange = (promoCode) => {
    this.setState({promoCode});
  };

  renderCouponList = () => {
    const {coupons, selectedRadioButtonIndex} = this.state;

    return coupons.map((item, index) => {
      const {id, code, description} = item;
      const obj = {label: code, value: index};

      const radioButton = (
        <RadioButton labelHorizontal={true}>
          <RadioButtonInput
            obj={obj}
            index={index}
            isSelected={index === selectedRadioButtonIndex}
            buttonSize={8}
            borderWidth={2}
            buttonColor="#333"
            onPress={this.handleRadioButtonPress}
          />
          <RadioButtonLabel
            obj={obj}
            index={index}
            labelHorizontal={true}
            onPress={this.handleRadioButtonPress}
            labelStyle={styles.radioButtonLabel}
          />
        </RadioButton>
      );

      return (
        <View key={index}>
          <PromoCodeListComponent item={item} radioButton={radioButton} />
          <View style={styles.separator} />
        </View>
      );
    });
  };

  handleRadioButtonPress = (selectedRadioButtonIndex) => {
    const {coupons} = this.state;
    const promoCode = coupons[selectedRadioButtonIndex].code;
    const promoCodeId = coupons[selectedRadioButtonIndex].id;
    this.setState({selectedRadioButtonIndex, promoCode, promoCodeId});
  };

  handleApplyCode = async () => {
    const {promoCode, promoCodeId} = this.state;

    // validations
    if (promoCode.trim() === '' && promoCodeId === null) {
      Alert.alert('', 'Please select/enter promo code', [{text: 'OK'}], {
        cancelable: false,
      });
      this.setState({promoCode: ''});
      return;
    }

    try {
      const {getParam, pop} = this.props.navigation;
      const info = getParam('info', null);

      if (info) {
        const {selectCouponCallback} = info;

        selectCouponCallback(promoCode, promoCodeId);

        // navigating back
        pop();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {promoCode, coupons, status, isProcessing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Promo Code"
          navAction="back"
          nav={this.props.navigation}
        />

        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter promo code here"
              placeholderTextColor="#999"
              style={styles.input}
              value={promoCode}
              onChangeText={this.handlePromoCodeChange}
            />

            <TouchableOpacity
              onPress={this.handleApplyCode}
              underlayColor="#F57C0080"
              style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          {coupons ? (
            <View style={styles.listContainer}>
              <RadioForm animation={true} style={styles.radioForm}>
                {this.renderCouponList()}
              </RadioForm>
            </View>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{status}</Text>
            </View>
          )}
        </View>

        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  mainContainer: {
    flex: 1,
    padding: wp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderRadius: wp(1),
  },
  input: {
    height: hp(6),
    flex: 1,
    fontSize: wp(3.5),
    paddingHorizontal: wp(2),
  },
  applyButton: {
    backgroundColor: '#F57C00',
    height: hp(6),
    justifyContent: 'center',
    paddingHorizontal: wp(4),
    borderRadius: wp(1),
  },
  applyButtonText: {
    fontSize: wp(3),
    color: '#fff',
  },
  listContainer: {
    flex: 1,
  },
  radioForm: {
    flex: 1,
  },
  radioButtonLabel: {
    color: '#333',
    fontSize: wp(3.4),
    fontWeight: '700',
  },
  separator: {
    height: wp(2),
  },
  applyCodeButton: {},
  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});
