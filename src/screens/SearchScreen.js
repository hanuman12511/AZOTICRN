import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, FlatList} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import HeaderComponent from '../components/HeaderComponent';
import SearchItemListComponent from '../components/SearchItemListComponent';

// VectorIcons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Styles
import basicStyles from '../styles/BasicStyles';

// Images
import short_video_img from '../assets/images/short_video_img.jpg';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: [
        {
          ProductName: 'Grilled Sandwich',
          chefName: 'Martin Moose',
          items: '1',
          leftTime: '15',
          proceedTime: '2',
          image: short_video_img,
          deliverTime: 'Today 9 pm',
        },
        {
          ProductName: 'Grilled Sandwich',
          chefName: 'Martin Moose',
          items: '1',
          leftTime: '15',
          proceedTime: '2',
          image: short_video_img,
          deliverTime: 'Today 9 pm',
        },
        {
          ProductName: 'Grilled Sandwich',
          chefName: 'Martin Moose',
          items: '1',
          leftTime: '15',
          proceedTime: '2',
          image: short_video_img,
          deliverTime: 'Today 9 pm',
        },
      ],
    };
  }

  searchItem = ({item}) => (
    <SearchItemListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent nav={this.props.navigation} showHeaderLogo />
        <View style={basicStyles.mainContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#999"
              style={styles.inputDesign}
            />
            <Ionicons
              name="md-search"
              color="#000"
              size={21}
              style={styles.iconRow}
            />
          </View>

          <View style={styles.flatContainer}>
            <FlatList
              data={this.state.searchData}
              renderItem={this.searchItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  searchContainer: {
    height: hp(5.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: wp(2),
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(2.75),
  },
  inputDesign: {
    flex: 1,
    height: hp(5.5),
  },
});
