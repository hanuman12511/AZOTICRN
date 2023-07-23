import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TimeSlot = (props) => {
  const {item, selectedTimeSlotId, selectTimeSlotCallback} = props;
  const {id, title} = item;
  const isSelected = id === selectedTimeSlotId;

  const handleSelectTimeSlot = () => {
    selectTimeSlotCallback(id);
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
    <TouchableOpacity
      underlayColor="transparent"
      onPress={handleSelectTimeSlot}
      style={styles.list}>
      <View style={slotContainerStyle}>
        <Text style={slotLabelStyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default TimeSlot;
const styles = StyleSheet.create({
  list: {
    width: wp(47),
    margin: wp(1),
  },
});
