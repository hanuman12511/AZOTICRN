import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import Textarea from 'react-native-textarea';
import CheckBox from '@react-native-community/checkbox';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Component
import CustomizeAddonsComponent from './CustomizeAddonsComponent';
import RadioComponent from '../PopUpComponents/RadioComponent';
import ProcessingLoader from '../ProcessingLoader';
import TimeSlotPopComponent from '../../components/TimeSlotPopComponent';
import {showToast} from '../CustomToast';

//  Styles
import basicStyles from '../../styles/BasicStyles';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

// API

import {makeNetworkRequest} from 'state/utils/makeNetworkRequest';

export default class CartOptionsPopUp extends Component {
  constructor(props) {
    super(props);

    const {quantity} = props.item;
    this.quantity = quantity;
    this.state = {
      isChecked: false,
      customId: null,
      addonId: '',
      selectedRadioButtonIndex: -1,
      selectedCustomization: 'b',
      note: '',
      isCustom: false,
      isAddOns: false,
      productVariants: null,
      price: 0,
      newPrice: 0,
      productAddOns: null,
      isProcessing: false,
      addOnAmount: 0,

      // Slots
      slotsInfo: null,
      selectedSlot: null,
      selectedSlotIndex: -1,
      selectedTimeSlotId: null,

      isLoading: true,
    };
    this.parentView = null;
    this.addonDetails = new Set();
  }

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  setViewRef = ref => {
    this.parentView = ref;
  };

  componentDidMount() {
    this.getProductDetails();
  }

  getProductDetails = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      const {productId} = this.props.item;
      const params = {
        productId,
      };

      // calling api
      const response = await makeNetworkRequest(
        'Customers/getProductDetail',
        params,
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
          const {quantity} = this.props.item;
          const {itemDetail} = response;
          let {
            productVariants,
            productAddOns,
            isCustom,
            isAddOns,
            price,
            slotsInfo,
          } = itemDetail;

          let nPrice = 0;

          if (price && isCustom === false) {
            nPrice = price * quantity;
          } else {
            nPrice = 0 * quantity;
          }

          if (slotsInfo) {
            const [selectedSlot] = slotsInfo;
            let tes = slotsInfo.indexOf(selectedSlot);

            const {slots} = selectedSlot;
            const [selectedTimeSlot] = slots;
            const {title: selectedTimeSlotId} = selectedTimeSlot;
            this.setState({
              price: nPrice,
              newPrice: nPrice,
              isCustom,
              isAddOns,
              productVariants,
              productAddOns,
              slotsInfo,
              selectedSlot,
              selectedTimeSlotId,
              selectedSlotIndex: tes,
              isLoading: false,
              isListRefreshing: false,
            });
          } else {
            this.setState({
              price: nPrice,
              newPrice: nPrice,
              isCustom,
              isAddOns,
              productVariants,
              productAddOns,
              slotsInfo,
              status: null,
              isLoading: false,
            });
          }
        } else {
          const {message} = response;

          this.setState({
            productVariants: null,
            productAddOns: null,
            status: message,
            posts: null,
            isLoading: false,
          });
        }
        // }
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

  handleAddToCart = async () => {
    const {customId, isCustom, selectedTimeSlotId, selectedSlot, slotsInfo} =
      this.state;

    console.log('====================================');
    console.log(this.state);
    console.log('====================================');
    // validations
    // if (isCustom === true) {
    //   if (!customId) {
    //     Alert.alert('Alert!', 'Select Personalization!', [{text: 'OK'}], {
    //       cancelable: false,
    //     });
    //     return;
    //   }
    // }

    if (this.props.typeOfVen === 'Vendor') {
      if (slotsInfo === null) {
        Alert.alert('Alert!', 'Cannot Order This Product!', [{text: 'OK'}], {
          cancelable: false,
        });
        return;
      }
    }

    try {
      const addonDetails = [...this.addonDetails];

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      // starting loader
      this.setState({isProcessing: true});

      const {deviceId} = deviceInfo;
      const {productId, quantity} = this.props.item;
      const {note} = this.state;

      let params = null;
      if (this.props.typeOfVen === 'Vendor') {
        params = {
          deviceId,
          productId,
          quantity,
          customId,
          addonId: JSON.stringify(addonDetails),
          note,
          deliveryDate: selectedSlot.date,
          deliverySlot: selectedTimeSlotId,
        };
      } else {
        params = {
          deviceId,
          productId,
          quantity,
          customId,
          addonId: JSON.stringify(addonDetails),
          note,
        };
      }

      // calling api
      const response = await makeNetworkRequest('Customers/addToCart', params);

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          const {cartCountUpdate} = this.props;

          this.props.closePopup();
          // this.props.nav.navigate('Cart');
          let msg = 'happy';
          await cartCountUpdate(msg);

          this.setState({
            isProcessing: false,
          });
          showToast(message);
        } else {
          const {deleteCart} = response;

          if (deleteCart) {
            // Alert.alert('Alert', message);
            Alert.alert(
              'Alert!',
              message,
              [
                {
                  text: 'Cancel',
                  onPress: this.stopIt,
                },
                {text: 'Remove', onPress: this.removeExistingItem},
              ],
              {
                cancelable: false,
              },
            );

            return;
          } else {
            showToast(message);
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

  stopIt = () => {
    this.setState({
      isProcessing: false,
    });
  };

  removeExistingItem = async () => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
      };

      // calling api
      const response = await makeNetworkRequest('Customers/deleteCart', params);

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({
          isProcessing: false,
        });

        if (success) {
          this.handleAddToCart();
          showToast(message);
        } else {
          showToast(message);
        }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
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

  handleCheckUnCheck = async () => {
    try {
      await this.setState({isChecked: !this.state.isChecked});
    } catch (error) {
      console.log(error.message);
    }
  };

  handleMessage = changedText => {
    this.setState({note: changedText});
  };

  handleRadioButtonPress = selectedRadioButtonIndex => {
    const {productVariants, price, addOnAmount} = this.state;
    const {quantity} = this.props.item;
    let custom = productVariants[selectedRadioButtonIndex].name;
    let customId = productVariants[selectedRadioButtonIndex].id;
    let amount = price + productVariants[selectedRadioButtonIndex].price;

    let newPrice = amount * quantity;

    this.setState({
      selectedRadioButtonIndex,
      selectedCustomization: custom,
      newPrice,
      customId,
    });
  };

  renderCustomization = () => {
    const {productVariants, selectedRadioButtonIndex} = this.state;

    return productVariants.map((item, index) => {
      const {name} = item;
      const obj = {label: name, value: index};

      const radioButton = (
        <RadioButton labelHorizontal={true}>
          <RadioButtonInput
            obj={obj}
            index={index}
            isSelected={index === selectedRadioButtonIndex}
            buttonSize={6}
            borderWidth={2}
            buttonColor={'#f65e83'}
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
          <RadioComponent item={item} radioButton={radioButton} />
          <View style={styles.separator} />
        </View>
      );
    });
  };

  handleAddons = (addAmount, isChecked, addonId) => {
    let {addOnAmount} = this.state;

    try {
      if (isChecked === true) {
        addOnAmount += addAmount;

        this.setState({addonId, addOnAmount});
      } else if (isChecked === false) {
        addOnAmount -= addAmount;

        this.setState({addonId, addOnAmount});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleAddonUpdate = (selected, id) => {
    if (selected) {
      this.addonDetails.add(id);
    } else {
      this.addonDetails.delete(id);
    }
  };

  renderAddon = ({item}) => (
    <CustomizeAddonsComponent
      item={item}
      nav={this.props.navigation}
      handleAddons={this.handleAddons}
      handleAddonUpdate={this.handleAddonUpdate}
      qty={this.quantity}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleSelectSlotDate = (selectedSlot, selectedSlotIndex) => () => {
    this.setState({selectedSlot, selectedSlotIndex});
  };

  selectTimeSlotCallback = selectedTimeSlotId => {
    this.setState({selectedTimeSlotId});
  };

  renderSlots = () => {
    const {slotsInfo, selectedSlotIndex} = this.state;

    return slotsInfo.map((slot, index) => {
      const {day, alias} = slot;

      let slotContainerStyle = [styles.dayTab];
      let slotDayStyle = [styles.day];
      let slotSubHeadingStyle = [styles.subHeading];
      if (selectedSlotIndex === index) {
        slotContainerStyle.push(styles.active);
        slotDayStyle.push(styles.activeText);
        slotSubHeadingStyle.push(styles.activeText);
      }

      return (
        <TouchableOpacity
          onPress={this.handleSelectSlotDate(slot, index)}
          underlayColor="#f65e8380"
          style={slotContainerStyle}
          key={index}>
          <View>
            <Text style={slotDayStyle}>{day}</Text>
            <Text style={slotSubHeadingStyle}>{alias}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  renderItem = ({item}) => (
    <TimeSlotPopComponent
      item={item}
      selectedTimeSlotId={this.state.selectedTimeSlotId}
      selectTimeSlotCallback={this.selectTimeSlotCallback}
    />
  );

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return null;
    }

    const {
      isCustom,
      isAddOns,
      newPrice,
      addOnAmount,
      selectedSlot,
      selectedTimeSlotId,
      slotsInfo,
    } = this.state;
    const {slots} = selectedSlot || {};
    const {quantity} = this.props.item;

    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView
            contentContainerStyle={[
              basicStyles.padding,
              styles.popupContainerInner,
            ]}>
            <Text
              style={[basicStyles.headingLarge, basicStyles.marginBottomHalf]}>
              Customer Order
            </Text>
            <Text style={[basicStyles.heading]}>Quantity: {quantity}</Text>

            <View style={basicStyles.separatorHorizontal} />
            {isCustom ? (
              <View style={[styles.dataContainer]}>
                <Text style={[basicStyles.text, basicStyles.marginBottomHalf]}>
                  Personalization
                </Text>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginBottomHalf,
                  ]}>
                  <CheckBox
                    style={styles.checkBoxStyle}
                    value={this.state.isChecked}
                    onValueChange={() => this.handleCheckUnCheck()}
                    boxType="square"
                  />
                  <Text>Cake</Text>
                </View>

                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginBottomHalf,
                  ]}>
                  <CheckBox
                    style={styles.checkBoxStyle}
                    value={this.state.isChecked}
                    onValueChange={() => this.handleCheckUnCheck()}
                    boxType="square"
                  />
                  <Text>Cake</Text>
                </View>

                <View style={[basicStyles.flexOne, basicStyles.marginTop]}>
                  {this.state.productVariants ? (
                    <RadioForm animation={true} style={styles.radioForm}>
                      {this.renderCustomization()}
                    </RadioForm>
                  ) : null}
                </View>
              </View>
            ) : null}

            {isAddOns ? (
              <View style={[styles.dataContainer]}>
                <Text
                  style={[basicStyles.text, basicStyles.marginVentricleHalf]}>
                  Add On
                </Text>
                <FlatList
                  data={this.state.productAddOns}
                  renderItem={this.renderAddon}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              </View>
            ) : null}

            {/* {slotsInfo ? (
              <View style={styles.deliverySlotsContainer}>
                <Text
                  style={[
                    basicStyles.heading,
                    basicStyles.marginVentricle,
                    {color: '#f65e83'},
                    // basicStyles.marginBottom,
                  ]}>
                  Choose Slot
                </Text>
                <View style={styles.deliverySlotsDayContainer}>
                  {this.renderSlots()}
                </View>

                <View style={styles.slots}>
                  <FlatList
                    data={slots}
                    extraData={selectedTimeSlotId}
                    renderItem={this.renderItem}
                    numColumns="2"
                    keyExtractor={this.keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                  />
                </View>
              </View>
            ) : null} */}

            {isCustom || isAddOns ? (
              <View style={basicStyles.separatorHorizontal} />
            ) : null}

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
              ]}>
              <Text style={basicStyles.heading}>Total Price</Text>
              <Text style={basicStyles.heading}>
                ₹ {newPrice + addOnAmount}
              </Text>
            </View>

            <View style={styles.textareaContainerMain}>
              <TextInput
                multiline
                style={styles.textarea}
                onChangeText={this.handleMessage}
                defaultValue={this.state.note}
                placeholder={'Add Note...'}
                placeholderTextColor={'#444'}
                underlineColorAndroid={'transparent'}
              />
            </View>

            <TouchableOpacity
              onPress={this.handleAddToCart}
              style={[styles.addCartButton]}>
              <Text style={[basicStyles.textBold, basicStyles.whiteColor]}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: hp(100),
    top: 0,
  },

  textarea: {
    padding: wp(2),
    backgroundColor: '#ccc4',
    height: hp(10),
    textAlignVertical: 'top',
    borderRadius: 5,
    marginTop: wp(2),
    marginBottom: wp(2),
  },

  popupContainer: {
    marginTop: hp(5),
    paddingBottom: hp(1),
    backgroundColor: '#fff',
    borderTopRightRadius: wp(5),
    borderTopLeftRadius: wp(5),
    // borderWidth: 2,
    // flex: 1,
    minHeight: hp(60),
    // position: 'absolute',
    // bottom: 0,
    // zIndex: 99999,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(3),
    marginBottom: hp(1),
  },

  pickerInput: {
    flex: 1,
    // height: hp(8),
  },

  checkBoxStyle: {
    color: '#fff',
    height: hp(1),
  },

  addCartButton: {
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#F57C00',
    marginTop: wp(2),
    marginBottom: wp(5),
  },
  textareaContainerMain: {
    height: hp(10),
    alignSelf: 'center',
    width: wp(94),
    borderRadius: 4,
    marginBottom: wp(2),
  },
  radioButtonLabel: {
    fontSize: wp(3.2),
    color: '#444',
    marginLeft: wp(1),
    marginRight: wp(10),
  },
  radioButton: {
    justifyContent: 'flex-start',
    marginTop: hp(1.5),
  },
  deliverySlotsContainer: {
    flex: 1,
    // marginVertical: hp(2),
    // borderBottomWidth: 0.5,
    paddingVertical: wp(2),
  },
  deliverySlotsDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // borderBottomWidth: 0.5,
    // borderBottomColor: '#ccc',
    marginHorizontal: wp(2),
  },
  active: {
    backgroundColor: '#f65e83',
    borderBottomWidth: 1,
    borderBottomColor: '#f65e83',
  },
  activeText: {
    color: '#fff',
  },
  dayTab: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    // backgroundColor: '#f2f1f1',
    padding: wp(2),
  },
  day: {
    fontSize: wp(3),
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#f65e83',
  },
  subHeading: {
    fontSize: wp(2.5),
    textAlign: 'center',
    color: '#f65e83',
  },
});
