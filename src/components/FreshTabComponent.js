import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images

import ic_star_white from '../assets/icons/ic_star_white.png';
import checked_green from '../assets/icons/checked_green.png';

// Style
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, storeData, getData} from '../api/UserPreference';

// API

export default class FoodTabComponent extends Component {
  constructor(props) {
    super(props);
    const {follow} = props.item;

    this.state = {
      followStatus: follow,
    };
  }

  handleFollow = async () => {
    const userInfo = await getData(KEYS.USER_INFO);

    if (!userInfo) {
      Alert.alert(
        'Alert!',
        'You Need To Login?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Login', onPress: this.onLoginPress},
        ],
        {
          cancelable: false,
        },
      );
      return;
    }

    let {followStatus} = this.state;

    if (followStatus === true) {
      this.setState({followStatus: false});
      followStatus = false;
    } else if (followStatus === false) {
      this.setState({followStatus: true});
      followStatus = true;
    }

    const {vendorId} = this.props.item;
    const {handleFollowVendor} = this.props;
    await handleFollowVendor(vendorId, followStatus);
  };

  onLoginPress = () => {
    this.props.nav.navigate('Register');
  };

  refreshCallback = async () => {
    const {fetchCartCount, fetchFoodVendors} = this.props;

    await fetchCartCount();
    await fetchFoodVendors();
  };

  handleVendorPage = () => {
    const {item} = this.props;
    item.initial = 0;
    this.props.nav.navigate('CuFarms', {
      item,
      refreshCallback: this.refreshCallback,
      handleFollow: this.handleFollow,
    });
  };

  render() {
    const {
      vendorName,
      vendorImage,
      avgRatings,
      bio,
      ratingCount,
      followCount,
    } = this.props.item;
    const {followStatus} = this.state;

    const orderContainerMain = {
      // backgroundColor: '#fff',
      // borderBottomWidth: 0.4,
      // borderBottomColor: '#888',
      // borderBottomRightRadius: wp(2.5),
      // borderTopLeftRadius: wp(2.5),
      padding: wp(4),
      // elevation: 5,
    };

    return (
      <TouchableOpacity
        style={orderContainerMain}
        onPress={this.handleVendorPage}>
        {/* <Image source={ic_plus} resizeMode="cover" style={styles.imageStyle} /> */}
        <View style={styles.orderContainer}>
          <Image
            source={{uri: vendorImage}}
            resizeMode="cover"
            style={styles.userProfile}
          />

          <View style={styles.contentContainer}>
            <View style={styles.nameContainer}>
              <Text style={[styles.nameText]}>
                {vendorName}
                {/* Kake di Hatti */}
              </Text>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  // basicStyles.paddingVentricle,
                ]}>
                {/* <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={myRating}
                    fullStar={ic_rate_star}
                    halfStar={ic_half_rating}
                    emptyStar={ic_no_rate}
                    starSize={12}
                  /> */}

                <View style={styles.stars}>
                  <Text style={[styles.rating]}>{avgRatings}</Text>
                  <Image
                    source={ic_star_white}
                    resizeMode="cover"
                    style={styles.starIcon}
                  />
                </View>

                <Text style={[basicStyles.text, basicStyles.grayColor]}>
                  ({ratingCount})
                </Text>
              </View>
            </View>

            <Text style={styles.descText}>{bio}</Text>

            <View style={styles.followButtonStyle}>
              {followStatus === true ? (
                <TouchableOpacity
                  style={[styles.followingButton]}
                  onPress={this.handleFollow}>
                  <Image
                    source={checked_green}
                    resizeMode="cover"
                    style={styles.checkIcon}
                  />
                  <Text style={[styles.buttonText, {color: '#42b06e'}]}>
                    Following
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.followButton]}
                  onPress={this.handleFollow}>
                  <Text style={[styles.buttonText, {color: '#F57C00'}]}>
                    + Follow ({followCount})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
  },
  rating: {
    fontSize: wp(3),
    color: '#fff',
    fontWeight: '700',
  },
  checkIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: 5,
  },
  starIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
  },
  stars: {
    backgroundColor: '#F57C00',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(1),
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: wp(1),
  },
  nameContainer: {
    flexDirection: 'row',
    marginTop: hp(1),
    marginBottom: wp(1),
  },
  contentContainer: {
    flex: 1,
  },

  textStyle: {
    fontSize: wp(2.7),
    color: '#fff',
    // marginRight: wp(1),
  },

  pmTextStyle: {
    fontSize: wp(3),
    marginLeft: wp(1),
  },

  vectorIconRow: {
    marginHorizontal: wp(0.8),
  },

  nameText: {
    padding: wp(0.6),
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
    flex: 1,
    // textAlign: 'center',
  },

  followButton: {
    padding: wp(1.5),
    flexDirection: 'row',
  },
  followingButton: {
    padding: wp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: wp(4),
  },
  userProfile: {
    width: wp(22),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: hp(7),
  },
  descText: {
    fontSize: wp(4),
    color: '#666',
    flex: 1,
  },
  buttonRow: {
    // position: 'absolute',
    // alignItems: 'center',
    // borderWidth: 2,
    // right: 3,
    // bottom: 18,
  },
  starCont: {
    height: hp(5),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonStyle: {
    // borderWidth: 1,
  },
});
