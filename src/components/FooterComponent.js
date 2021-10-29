import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from '../styles/BasicStyles';

// icons
import ic_news_feed from '../assets/icons/ic_news_feed.png';
import ic_news_feed_green from '../assets/icons/ic_news_feed_green.png';
import ic_live from '../assets/icons/ic_live.png';
import ic_live_green from '../assets/icons/ic_live_green.png';
import ic_food_vendor from '../assets/icons/ic_food_vendor.png';
import ic_food_vendor_green from '../assets/icons/ic_food_vendor_green.png';
import ic_fresh_farm from '../assets/icons/ic_fresh_farm.png';
import ic_fresh_farm_green from '../assets/icons/ic_fresh_farm_green.png';

export default class FooterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleNewsFeed = () => {
    this.props.nav.navigate('NewsFeeds');
  };
  handleLiveNow = () => {
    this.props.nav.navigate('Live');
  };
  handleFoodVendor = () => {
    this.props.nav.navigate('Food');
  };
  handleFreshFarm = () => {
    this.props.nav.navigate('Fresh');
  };

  render() {
    const {tab} = this.props;
    const activeStyle = [styles.footerMenu, {borderTopColor: '#00b8a9'}];
    return (
      <View style={[basicStyles.directionRow, styles.footerComponent]}>
        <TouchableHighlight
          onPress={this.handleNewsFeed}
          underlayColor="transparent"
          style={tab === 'News' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'News' ? ic_news_feed_green : ic_news_feed}
            resizeMode="cover"
            style={styles.footerIcon}
          />
          {/* <Text>{tab}</Text> */}
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleLiveNow}
          underlayColor="transparent"
          style={tab === 'Live' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'Live' ? ic_live_green : ic_live}
            resizeMode="cover"
            style={styles.footerIcon}
          />
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleFoodVendor}
          underlayColor="transparent"
          style={tab === 'Food' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'Food' ? ic_food_vendor_green : ic_food_vendor}
            resizeMode="cover"
            style={styles.footerIcon}
          />
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleFreshFarm}
          underlayColor="transparent"
          style={tab === 'Fresh' ? activeStyle : styles.footerMenu}>
          <Image
            source={tab === 'Fresh' ? ic_fresh_farm_green : ic_fresh_farm}
            resizeMode="cover"
            style={styles.footerIcon}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerComponent: {
    height: hp(6),
  },
  footerIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderColor: '#f2f1f1',
  },
});
