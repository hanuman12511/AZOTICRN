import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PromoCodeListComponent = (props) => {
  const {item, radioButton} = props;
  const {id, code, description} = item;

  return (
    <View style={styles.listContainer}>
      {radioButton}
      <View style={styles.separator} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default PromoCodeListComponent;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: wp(2),
  },
  separator: {
    backgroundColor: '#ccc',
    height: 1,
    marginVertical: hp(0.5),
  },
  description: {
    fontSize: wp(3),
  },
});
