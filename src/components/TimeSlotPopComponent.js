import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TimeSlot = (props) => {
  const {item, selectedTimeSlotId, selectTimeSlotCallback} = props;
  const {title} = item;
  const isSelected = title === selectedTimeSlotId;

  const handleSelectTimeSlot = () => {
    selectTimeSlotCallback(title);
  };

  // dynamic styles
  const slotContainerStyle = {
    padding: wp(2),
    backgroundColor: isSelected ? '#666' : '#fff',
    borderColor: isSelected ? '#999' : '#666',
    borderWidth: 0.6,
  };

  const slotLabelStyle = {
    fontSize: wp(3),
    color: isSelected ? '#fff' : '#333',
    textAlign: 'center',
  };

  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={handleSelectTimeSlot}
      style={styles.list}>
      <View style={slotContainerStyle}>
        <Text style={slotLabelStyle}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default TimeSlot;
const styles = StyleSheet.create({
  list: {
    width: wp(47),
    margin: wp(1),
  },
});
