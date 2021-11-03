import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  BackHandler,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import ImageSlider from 'react-native-image-slider';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons

// icons
import ic_like_fill from '../assets/icons/ic_like_fill.png';
import ic_comment_border from '../assets/icons/ic_comment_border.png';
import ic_send from '../assets/icons/ic_send.png';

// Style
import basicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import GalTabCommentComponent from '../components/GalTabCommentComponent';

// UserPreference
import {KEYS, getData} from 'state/utils/UserPreference';

export default class GalleryDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorName: '',
      city: '',
      vendorImage: null,
      mediaUrl: '',
      likes: '',
      description: '',
      comments: '',
      postTime: '',
      likedBy: '',
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  backAction = () => {
    this.props.navigation.pop();
    return true;
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleCommentScreen = async () => {
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
    } else {
      const item = this.props.navigation.getParam('item', null);

      this.props.navigation.navigate('Comment', {item});
    }
  };

  onLoginPress = () => {
    this.props.navigation.navigate('Register');
  };

  renderItem = ({item}) => (
    <GalTabCommentComponent
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const item = this.props.navigation.getParam('item', null);

    const {
      vendorName,
      city,
      vendorImage,
      mediaUrl,
      likes,
      description,
      commentCount,
      comments,
      postTime,
      likedBy,
    } = item;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Vendors"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
          showAccountIcon
        />

        <ScrollView style={basicStyles.mainContainer}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            <Image
              source={{uri: vendorImage}}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
            <View style={basicStyles.flexOne}>
              <Text style={basicStyles.heading}>{vendorName}</Text>
              <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
                {postTime}
              </Text>
            </View>
          </View>

          <Text
            style={[
              basicStyles.text,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfBottom,
              basicStyles.marginTopHalf,
            ]}>
            {/* <Text style={basicStyles.textBold}>{vendorName}</Text>  */}
            {description}
          </Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyCenter,
              {borderWidth: 0.3, borderColor: '#888'},
            ]}>
            {/* <Image
              source={vendorImage}
              resizeMode="cover"
              style={styles.imageBig}
            /> */}
            <ImageSlider
              images={mediaUrl}
              style={{width: wp(100), aspectRatio: 1 / 1}}
            />
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            <TouchableOpacity
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                styles.likeBtnActive,
              ]}>
              <Image
                source={ic_like_fill}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              <Text style={[basicStyles.text, styles.activeText]}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleCommentScreen}
              style={[
                basicStyles.marginRight,
                basicStyles.alignCenter,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_comment_border}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              <Text style={basicStyles.text}>{commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handelComment}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_send}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              {/* <Text style={basicStyles.text}>11</Text> */}
            </TouchableOpacity>
          </View>

          <Text style={[basicStyles.text, basicStyles.paddingHorizontal]}>
            <Text style={[basicStyles.text, basicStyles.textBold]}>
              {likedBy}
            </Text>
            <Text style={basicStyles.grayColor}> liked this post.</Text>
          </Text>

          <TouchableOpacity onPress={this.handleCommentScreen}>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.paddingHorizontal,
                basicStyles.marginTop,
              ]}>
              All Comments ({commentCount})
            </Text>
          </TouchableOpacity>

          <FlatList
            data={comments}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  newsFeedsImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
    borderColor: '#666',
    borderWidth: 0.5,
  },
  imageBig: {
    width: wp(92),
    aspectRatio: 1 / 1,
  },
  likeBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f57c0040',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: wp(2),
  },
  activeText: {
    color: '#f57c00',
    fontWeight: 'bold',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  commentContainer: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc4',
  },
});
