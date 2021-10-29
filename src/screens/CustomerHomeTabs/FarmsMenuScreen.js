import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  BackHandler,
  Pressable,
} from 'react-native';

// Permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Modal, {ModalContent, BottomModal} from 'react-native-modals';
import DocumentPicker from 'react-native-document-picker';
import PickerModal from 'react-native-picker-modal-view';

// Components
import FarmMenuComponent from '../../components/FarmMenuComponent';
import CustomizeAddonsComponent from '../../components/PopUpComponents/CustomizeAddonsComponent';
import RadioComponent from '../../components/PopUpComponents/RadioComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import TimeSlotPopComponent from '../../components/TimeSlotPopComponent';
import {showToast} from '../../components/CustomToast';
import CameraItemComponent from '../../components/CameraItemComponent';

// Popup
import CartOptionsPopUp from '../../components/PopUpComponents/CartOptionsPopUp';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_camara from '../../assets/icons/ic_camara.png';
import ic_down from '../../assets/icons/ic_down.png';

// UserPreference
import {KEYS, storeData, clearData, getData} from '../../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

import {InstagramLoader} from 'react-native-easy-content-loader';

export default class FarmsMenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      contentLoading: true,
      isListRefreshing: false,
      showQualityPopup: false,
      productId: -1,
      // new props
      isChecked: false,
      customId: -1,
      addonId: '',
      selectedRadioButtonIndex: 0,
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
      newAmount: 0,
      quantity: 1,
      cameraImages: [],
      deliveryDate: null,
      slotsData: [],
      selectedSlots: {
        Id: -1,
        Name: 'Select Slot',
        Value: 'Select Slot',
      },
    };

    this.parentView = null;
    this.addonDetails = new Set();
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.proIdUpdate();
    this.fetchVendorMenu();
    this.fetchCartCount();
  }

  backAction = () => {
    if (this.state.showQualityPopup) {
      this.closePopup();
      return true;
    }
  };

  proIdUpdate = async () => {
    const {productId, activeStatus} = await this.props;
    if (productId && activeStatus) {
      this.productId = productId;
      this.activeStatus = activeStatus;
    }
  };

  fetchCartCount = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      const {deviceId} = deviceInfo;

      const params = {
        deviceId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/cartCount',
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
          const {cartCount: cartItemCount} = response;
          await storeData(KEYS.CART_ITEM_COUNT, {cartItemCount});

          this.setState({
            cartItemCount,
          });
        }
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

  fetchVendorMenu = async (selectedSlots = null) => {
    try {
      // starting loader
      // this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);

      const {vendorId} = await this.props;

      let params = null;
      let response = null;

      if (!userInfo) {
        params = {
          vendorId,
          type: 'farm',
          slotId: selectedSlots ? selectedSlots.Id : '',
          slotDate: this.state.deliveryDate,
        };

        // calling api
        response = await makeRequest(
          BASE_URL + 'Customers/vendorProducts',
          params,
        );
      } else if (userInfo) {
        const {payloadId} = userInfo;

        params = {
          vendorId,
          type: 'farm',
          payloadId,
          slotId: selectedSlots ? selectedSlots.Id : '',
          slotDate: this.state.deliveryDate,
        };

        // calling api
        response = await makeRequest(
          BASE_URL + 'Customers/vendorProducts',
          params,
        );
      }

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
          const {products, slots, selectedSlot} = response;

          const slotsData = slots.map((item) => ({
            Id: item.id,
            Name: item.slot,
            Value: item.slot,
          }));

          let newSlot = this.state.selectedSlots;
          if (selectedSlot) {
            newSlot = {
              Id: selectedSlot.id,
              Name: selectedSlot.slot,
              Value: selectedSlot.slot,
            };
          }

          this.setState({
            slotsData,
            products,
            selectedSlots: newSlot,
            status: null,
          });
        } else {
          const {message, slots, selectedSlot} = response;

          const slotsData = slots.map((item) => ({
            Id: item.id,
            Name: item.slot,
            Value: item.slot,
          }));

          let newSlot = this.state.selectedSlots;
          if (selectedSlot) {
            newSlot = {
              Id: selectedSlot.id,
              Name: selectedSlot.slot,
              Value: selectedSlot.slot,
            };
          }

          this.setState({
            slotsData,
            selectedSlots: newSlot,
            status: message,
            products: null,
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

  handleAddToFavs = async (productId, addFavStatus) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        productId,
        status: addFavStatus,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/addToFavourite',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        this.setState({isProcessing: false});
        if (success) {
          const {follow} = response;

          showToast(message);
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

  handleQualityPopup = async (productId, quantity) => {
    await this.setState({productId});
    await this.getProductDetails(productId);
    this.setState({showQualityPopup: true});
  };

  cartCountUpdate = async (msg) => {
    const {fetchCartItemCount} = this.props;

    await fetchCartItemCount(msg);
  };

  closePopup = () => {
    this.setState({
      showQualityPopup: false,
      cameraImages: [],
      quantity: 1,
      price: 0,
      newPrice: 0,
      addOnAmount: 0,
      newAmount: 0,
      note: '',
      selectedRadioButtonIndex: 0,
      isCustom: false,
      customId: -1,
      addonId: -1,
      productVariants: false,
    });
  };

  //Cart Pop Up Content
  getProductDetails = async (productId) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        productId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/getProductDetail',
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
          const {itemDetail} = response;
          let {
            productVariants,
            productAddOns,
            isCustom,
            isAddOns,
            productPrice,
            slotsInfo,
          } = itemDetail;

          let nPrice = 0;

          if (productPrice && isCustom === false) {
            nPrice = productPrice * 1;
          } else {
            nPrice = productPrice * 1;
          }

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
    let {
      customId,
      isCustom,
      deliveryDate,
      selectedSlots,
      cameraImages,
      productVariants,
    } = this.state;

    if (selectedSlots.Id === -1) {
      Alert.alert('Alert!', 'Select Slot First!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      if (isCustom && customId === -1) {
        customId = productVariants[0].id;
      }

      const addonDetails = [...this.addonDetails];

      const deviceInfo = await getData(KEYS.DEVICE_UNIQUE_ID);

      if (!deviceInfo) {
        return;
      }

      // starting loader
      this.setState({isProcessing: true});

      const {deviceId} = deviceInfo;
      const {productId, quantity} = this.state;
      const {note} = this.state;

      let params = {
        deviceId,
        productId,
        quantity,
        customId,
        addonId:
          Object.keys(addonDetails).length > 0
            ? JSON.stringify(addonDetails)
            : 0,
        note,
        deliverySlot: selectedSlots.Id,
        deliveryDate,
        images: cameraImages,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'Customers/addToCart',
        params,
      );

      // Processing Response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.closePopup();
          // this.props.nav.navigate('Cart');
          let msg = 'happy';
          await this.cartCountUpdate(msg);

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
      const response = await makeRequest(
        BASE_URL + 'Customers/deleteCart',
        params,
      );

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

  handleMessage = (changedText) => {
    this.setState({note: changedText});
  };

  handleRadioButtonPress = (selectedRadioButtonIndex) => {
    const {productVariants, price, addOnAmount} = this.state;
    const {quantity} = this.state;
    let custom = productVariants[selectedRadioButtonIndex].name;
    let customId = productVariants[selectedRadioButtonIndex].id;
    let amount = productVariants[selectedRadioButtonIndex].price;

    let newPrice = amount * quantity;

    this.setState({
      selectedRadioButtonIndex,
      selectedCustomization: custom,
      newPrice,
      price: amount,
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
            borderWidth={3}
            buttonInnerColor={'#F57C00'}
            buttonOuterColor={'#F57C00'}
            buttonSize={16}
            buttonOuterSize={18}
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
          <View style={styles.separatorRadio} />
        </View>
      );
    });
  };

  handleAddons = (newAmount, isChecked, addonId) => {
    let {addOnAmount, quantity} = this.state;

    try {
      if (isChecked === true) {
        addOnAmount += newAmount;

        this.setState({addOnAmount, newAmount: addOnAmount});
      } else if (isChecked === false) {
        addOnAmount -= newAmount;

        this.setState({addOnAmount: addOnAmount});
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
      qty={this.state.quantity}
    />
  );

  handleSelectSlotDate = (selectedSlot, selectedSlotIndex) => () => {
    this.setState({selectedSlot, selectedSlotIndex});
  };

  renderItem = ({item}) => (
    <FarmMenuComponent
      item={item}
      nav={this.props.navigation}
      productId={this.productId}
      activeStatus={this.activeStatus}
      handleQualityPopup={this.handleQualityPopup}
      handleAddToFavs={this.handleAddToFavs}
    />
  );

  cameraImageItem = ({item, index}) => (
    <CameraItemComponent
      item={item}
      nav={this.props.navigation}
      productId={this.productId}
      handleRemoveImage={this.handleRemoveImage}
      itemIndex={index}
    />
  );

  handleRemoveImage = (itemIndex) => {
    let removedImages = this.state.cameraImages;

    if (itemIndex > -1) {
      removedImages.splice(itemIndex, 1);

      this.setState({cameraImages: removedImages});
    }
  };

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

  handleAddition = async () => {
    let {quantity} = this.state;
    quantity = quantity + 1;
    this.setState({quantity});
  };

  handleSubtraction = async () => {
    let {quantity} = this.state;
    quantity = quantity - 1;
    if (quantity > 0) {
      this.setState({quantity});
    }
  };

  handlePermission = async () => {
    const {cameraImages} = this.state;

    if (Object.keys(cameraImages).length > 3) {
      Alert.alert('Alert!', 'Cannot Add More Than 3 Images');
      return;
    }

    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  handleImagePick = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images, DocumentPicker.types.allFiles],
      });

      if (Object.keys(response).length > 3) {
        Alert.alert('Alert!', 'Cannot Add More Than 3 Images');
        return;
      }

      this.setState({cameraImages: response});
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleSelectSlot = async (selectedSlots) => {
    if (Object.keys(selectedSlots).length > 0) {
      const {Value} = selectedSlots;
      await this.setState({selectedSlots, deliveryDate: Value});
      await this.fetchVendorMenu(selectedSlots);
    }
    return selectedSlots;
  };

  handleSelectSlotClose = () => {
    const {selectedSlots} = this.state;
    this.setState({selectedSlots});
  };

  renderSlotsPicker = (disabled, selected, showModal) => {
    const {selectedSlots} = this.state;
    const {Name} = selectedSlots;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3.8),
      flex: 1,
      marginLeft: wp(2),
    };

    if (Name === 'Select State') {
      labelStyle.color = '#555';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <View style={styles.slotDesign} />
          <Text style={labelStyle}>{Name}</Text>
          <Image source={ic_down} resizeMode="cover" style={styles.downIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      showQualityPopup,
      products,
      contentLoading,
      isCustom,
      isAddOns,
      addOnAmount,
      quantity,
      price,
      slotsData,
      selectedSlots,
      cameraImages,
    } = this.state;

    let addons = addOnAmount * quantity;
    let newPrice = price * quantity;
    return (
      <View style={styles.container}>
        {contentLoading === true ? (
          <View>
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
            <InstagramLoader active loading={contentLoading} />
          </View>
        ) : (
          <View style={styles.container}>
            <PickerModal
              items={slotsData}
              selected={selectedSlots}
              onSelected={this.handleSelectSlot}
              onClosed={this.handleSelectSlotClose}
              backButtonDisabled
              showToTopButton={true}
              autoGenerateAlphabeticalIndex={false}
              searchPlaceholderText="Search"
              renderSelectView={this.renderSlotsPicker}
            />
            {products ? (
              <View style={basicStyles.paddingTop}>
                <FlatList
                  data={this.state.products}
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
              <View style={[basicStyles.noDataStyle]}>
                <Text style={[basicStyles.noDataTextStyle]}>
                  No Item Available.
                </Text>
              </View>
            )}

            <BottomModal
              visible={this.state.showQualityPopup}
              onTouchOutside={this.closePopup}>
              <ModalContent
                style={{
                  minHeight: hp(30),
                }}>
                <View style={styles.popupContainer}>
                  <ScrollView
                    contentContainerStyle={[styles.popupContainerInner]}>
                    <View style={basicStyles.directionRow}>
                      <Text
                        style={[
                          basicStyles.headingLarge,
                          basicStyles.marginRight,
                        ]}>
                        Quantity:
                      </Text>
                      <View style={[basicStyles.directionRow, styles.addLess]}>
                        <Pressable
                          onPress={this.handleSubtraction}
                          style={({pressed}) => [
                            {
                              opacity: pressed ? 0.2 : 1.0,
                              zIndex: 99,
                            },
                          ]}>
                          <Text style={styles.lessValue}>-</Text>
                        </Pressable>

                        <Text style={styles.quantity}>{quantity}</Text>

                        <Pressable
                          onPress={this.handleAddition}
                          style={({pressed}) => [
                            {
                              opacity: pressed ? 0.2 : 1.0,
                              zIndex: 99,
                            },
                          ]}>
                          <Text style={styles.lessValue}>+</Text>
                        </Pressable>
                      </View>
                    </View>

                    {isCustom ? (
                      <View style={[styles.dataContainer]}>
                        <View
                          style={[
                            basicStyles.flexOne,
                            // basicStyles.marginTopHalf,
                          ]}>
                          {this.state.productVariants ? (
                            <RadioForm
                              animation={true}
                              style={styles.radioForm}>
                              {this.renderCustomization()}
                            </RadioForm>
                          ) : null}
                        </View>
                      </View>
                    ) : null}

                    {isAddOns ? (
                      <View style={[styles.dataContainer]}>
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
                        ₹ {newPrice + addons}
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
                      <TouchableOpacity onPress={this.handlePermission}>
                        <Image
                          source={ic_camara}
                          resizeMode="cover"
                          style={basicStyles.iconColumn}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={basicStyles.marginTop}>
                      <FlatList
                        data={cameraImages}
                        renderItem={this.cameraImageItem}
                        keyExtractor={this.keyExtractor}
                        horizontal
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                        contentContainerStyle={styles.listContainer}
                        extraData={this.state}
                      />
                    </View>

                    <Pressable
                      onPress={this.handleAddToCart}
                      // style={[styles.addCartButton]}
                      style={({pressed}) => [
                        {
                          opacity: pressed ? 0.2 : 1.0,
                          zIndex: 99,
                        },
                        styles.addCartButton,
                      ]}>
                      <Text
                        style={[basicStyles.textBold, basicStyles.whiteColor]}>
                        Add to Cart
                      </Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </ModalContent>
            </BottomModal>
          </View>
        )}
        {this.state.isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: wp(2),
  },
  addLess: {
    backgroundColor: '#fff',
    marginLeft: wp(1),
    borderRadius: wp(1),
  },
  addButton: {
    // backgroundColor: '#ff6000',
    // width: hp(5),
    // height: hp(4),
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderBottomRightRadius: wp(3),
    // borderTopLeftRadius: wp(3),
    padding: wp(4),
    marginTop: hp(-7),
    position: 'absolute',
    right: 0,
  },
  addIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    opacity: 0.5,
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 25,
    lineHeight: 25,
    textAlign: 'center',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 40,
    lineHeight: 25,
    textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#3334',
    height: 25,
    width: 25,
    lineHeight: 25,
    textAlign: 'center',
    fontSize: wp(4),
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
    color: '#fff',
    fontSize: wp(3.8),
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: wp(3.8),
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
    height: wp(4),
  },
  separatorRadio: {
    height: wp(1),
  },
  listContainer: {
    // marginTop: hp(2),
    paddingLeft: wp(-2),
  },

  // Pop up style

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
    flex: 1,
    padding: wp(2),
    backgroundColor: '#ccc4',
    height: hp(10),
    textAlignVertical: 'top',
    borderRadius: 5,
    // marginLeft: wp(3),
    marginRight: wp(2),
    // marginTop: wp(2),
    // marginBottom: wp(2),
  },

  popupContainer: {
    // marginTop: hp(5),
    // paddingBottom: hp(1),
    // backgroundColor: '#fff',
    // borderTopRightRadius: wp(5),
    // borderTopLeftRadius: wp(5),
    // borderWidth: 2,
    // flex: 1,
    // minHeight: hp(60),
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
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#F57C00',
    marginTop: wp(2),
    // marginBottom: wp(2),
  },
  textareaContainerMain: {
    height: hp(10),
    // alignSelf: 'center',
    // width: wp(94),
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  radioButtonLabel: {
    fontSize: wp(3.8),
    color: '#444',
    fontWeight: '700',
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
    backgroundColor: '#ff6000',
    borderBottomWidth: 1,
    borderBottomColor: '#ff6000',
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
    fontSize: wp(3.8),
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#ff6000',
  },
  subHeading: {
    fontSize: wp(3.8),
    textAlign: 'center',
    color: '#ff6000',
  },
  inputContainer: {
    backgroundColor: '#f5f5f5',
    height: hp(5.5),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    marginBottom: wp(3),
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#ccc8',
    marginVertical: wp(3),
  },
  downIcon: {
    width: wp(3),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  slotDesign: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ff6000',
  },
});
