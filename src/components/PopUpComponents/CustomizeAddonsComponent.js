import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import CheckBox from '@react-native-community/checkbox';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Style
import basicStyles from '../../styles/BasicStyles';

export default class CustomizeAddonsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };
  }

  handleCheckUnCheck = async () => {
    const {name, price, id} = this.props.item;
    const {handleAddonUpdate, handleAddons, qty} = this.props;

    try {
      await this.setState({isChecked: !this.state.isChecked});
      let newPrice = price;

      handleAddons(newPrice, this.state.isChecked, id);
      handleAddonUpdate(this.state.isChecked, id);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleGenderChange = (gender) => {
    this.setState({gender});
  };

  render() {
    const {name, price} = this.props.item;

    return (
      <View style={[styles.container]}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            basicStyles.alignCenter,
          ]}>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <CheckBox
              style={styles.checkBoxStyle}
              value={this.state.isChecked}
              onValueChange={() => this.handleCheckUnCheck()}
              boxType="square"
              tintColors={{true: '#F15927', false: '#999'}}
            />
            <Text style={styles.heading}>{name}</Text>
          </View>
          <Text style={[basicStyles.text]}>₹ {price}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
  },
  checkBoxStyle: {
    color: '#fff',
    height: hp(2),
    marginLeft: wp(-1.5),
  },
  heading: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#444',
    marginLeft: wp(1.2),
  },
  padd: {
    paddingTop: wp(2),
  },
});
