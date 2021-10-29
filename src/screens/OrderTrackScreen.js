import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, BackHandler} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../components/HeaderComponent';

// Styles
import basicStyles from '../styles/BasicStyles';

import StepIndicator from 'react-native-step-indicator';

// Images

export default class OrderTrackScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);

    const {
      deliveryCharge,
      items,
      finalAmount,
      orderStatus,
      placedDate,
      deliveryDate,
      orderId,
      image,
      vendorName,
      vendorImage,
      orderName,
    } = item;

    let currentPosition = 4;

    if (
      orderStatus === null ||
      orderStatus === 'pending' ||
      orderStatus === 'Pending'
    ) {
      currentPosition = 0;
    } else if (orderStatus === 'Order Ready For Delivery') {
      currentPosition = 1;
    } else if (orderStatus === 'ready' || orderStatus === 'Ready') {
      currentPosition = 2;
    } else if (orderStatus === 'dispatched' || orderStatus === 'Dispatched') {
      currentPosition = 3;
    }

    this.state = {
      currentPosition,
      labels: ['Pending', 'Processing', 'Ready', 'Dispatched'],

      finalAmount,
      placedDate,
      deliveryDate,
      orderId,
      image,
      vendorName,
      vendorImage,
      orderName,
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

  render() {
    const {
      finalAmount,
      placedDate,
      deliveryDate,
      orderId,
      image,
      vendorName,
      vendorImage,
      orderName,
    } = this.state;

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
      currentStepLabelColor: '#fe7013',
    };

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            navAction="back"
            showAccountIcon
            showCartIcon
            nav={this.props.navigation}
            headerTitle="Track Order"
          />
          <View style={basicStyles.flexOne}>
            <View
              style={styles.orderContainer}
              onPress={this.handleGoToDetails}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.padding,
                  styles.infoBox,
                ]}>
                <Image
                  source={{uri: image}}
                  resizeMode="cover"
                  style={styles.imageStyle}
                />
                <View style={styles.contentContainer}>
                  <Text style={basicStyles.headingLarge}>{orderName}</Text>
                  <View
                    style={[
                      basicStyles.directionRow,
                      basicStyles.alignCenter,
                      basicStyles.marginTopHalf,
                    ]}>
                    <Image
                      source={{uri: vendorImage}}
                      resizeMode="cover"
                      style={styles.vImage}
                    />
                    <Text style={basicStyles.heading}>{vendorName}</Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.justifyBetween,
                  basicStyles.paddingHorizontal,
                  basicStyles.paddingBottom,
                ]}>
                <View>
                  <Text>{placedDate}</Text>
                  <Text>Order ID: {orderId}</Text>
                </View>
                <Text style={[styles.textStyle, basicStyles.marginTopHalf]}>
                  Amount: INR {finalAmount}
                </Text>
              </View>
            </View>

            <View style={{flex: 1, padding: wp(2)}}>
              <StepIndicator
                customStyles={customStyles}
                stepCount={4}
                direction="vertical"
                currentPosition={this.state.currentPosition}
                labels={this.state.labels}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingLeft: wp(4),
  },
  imageStyle: {
    width: wp(30),
    aspectRatio: 1 / 1,
    borderRadius: 10,
    borderWidth: 2,
  },
  vImage: {
    width: wp(8),
    aspectRatio: 1 / 1,
    borderRadius: wp(4),
    marginRight: wp(2),
  },
  textStyle: {
    fontSize: wp(4.5),
    color: '#333',
    fontWeight: '700',
  },
  trackImage: {
    width: wp(100),
    aspectRatio: 1 / 1.27,
  },
});
