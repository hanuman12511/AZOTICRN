import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_delete from '../assets/icons/ic_delete.png';
import ic_home_orange from '../assets/icons/ic_home_orange.png';
import basicStyles from '../styles/BasicStyles';

export default class MyAddressListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDeleteAddress = () => {
    Alert.alert(
      'Alert!',
      'Confirm Address Removal?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', onPress: this.handleDelete},
      ],
      {
        cancelable: false,
      },
    );
    return;
  };

  handleDelete = async () => {
    const {deleteAddressCallback} = this.props;
    const {addressId} = this.props.item;
    try {
      await deleteAddressCallback(addressId);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleEdit = () => {};

  render() {
    const {nickName, name, address} = this.props.item;
    return (
      <View style={[styles.listContainer]}>
        <View style={styles.flex}>
          <Image
            source={ic_home_orange}
            resizeMode="cover"
            style={[basicStyles.iconColumn, basicStyles.marginBottomHalf]}
          />
          <Text
            style={[basicStyles.headingLarge, basicStyles.marginBottomHalf]}>
            {nickName}
          </Text>
          {/* <Text style={[styles.text, styles.spaceHalf]}>{name}</Text> */}
          <Text style={[styles.text]}>{address}</Text>
        </View>

        <View style={basicStyles.directionRow}>
          <TouchableOpacity onPress={this.handleEdit}>
            {/* <Text style={[basicStyles.orangeColor, basicStyles.marginRight]}>
              EDIT
            </Text> */}
            {/* <Image
              source={ic_delete}
              resizeMode="cover"
              style={styles.btnIcon}
            /> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleDeleteAddress}>
            <Text style={[basicStyles.orangeColor, basicStyles.marginRight]}>
              DELETE
            </Text>
            {/* <Image
              source={ic_delete}
              resizeMode="cover"
              style={styles.btnIcon}
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(4),
    backgroundColor: '#fafafa',
  },

  space: {
    marginBottom: wp(2),
  },
  spaceHalf: {
    marginBottom: wp(1),
  },
  alignItems: {
    alignItems: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  bold: {
    fontWeight: '700',
  },
  text: {
    fontSize: wp(3.5),
    marginBottom: wp(2),
    color: '#555',
  },
  color: {
    color: '#2bb256',
  },
  icon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    marginLeft: wp(3),
  },

  btnIcon: {
    height: wp(2.5),
    aspectRatio: 1 / 1,
  },
});
