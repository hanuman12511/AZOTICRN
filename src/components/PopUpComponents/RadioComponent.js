import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RadioComponent = (props) => {
  const {item, radioButton} = props;
  const {id, code, price} = item;

  return (
    <View style={styles.listContainer}>
      {radioButton}
      {/* <View style={styles.separator} />
       */}
      <Text style={styles.description}>₹ {price}</Text>
    </View>
  );
};

export default RadioComponent;

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: wp(0.5),
    borderRadius: wp(2),
  },

  description: {
    fontSize: wp(3.8),
    color: '#444',
  },
});
