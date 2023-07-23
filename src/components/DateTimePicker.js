import React, {Component} from 'react';
import {Text, TouchableHighlight, Image, View, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
// import ic_calendar from '../assets/icons/ic_drawer_attendance.png';

export default class DateTimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      selectedDate: 'DOB',
    };
  }

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePickerConfirm = (dateObj) => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;

    this.setState({selectedDate, isVisible: false});
    this.props.onDateChange(selectedDate);
  };

  render() {
    const {isVisible, selectedDate} = this.state;

    return (
      <View style={styles.datePicker}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.showPicker}>
          <View style={styles.buttonContainer}>
            <Text
              style={
                selectedDate !== 'DOB'
                  ? [styles.selectedDate, {color: '#333'}]
                  : styles.selectedDate
              }>
              {selectedDate}
            </Text>
            {/* <Image
              source={ic_calendar}
              resizeMode="cover"
              style={styles.calendarIcon}
            /> */}
          </View>
        </TouchableHighlight>

        <DateTimePickerModal
          isVisible={isVisible}
          mode="date"
          onConfirm={this.handlePickerConfirm}
          onCancel={this.hidePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datePicker: {
    fontSize: wp(4),
    borderRadius: wp(1.5),
    paddingHorizontal: wp(3),
    height: hp(5.5),
    backgroundColor: '#FAFAFA',
    marginBottom: wp(3),
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarIcon: {
    width: wp(6),
    aspectRatio: 1 / 1,
    // marginRight: wp(2),
  },
  selectedDate: {
    fontSize: wp(4),
    marginLeft: wp(0),
    color: '#999',
  },
});
