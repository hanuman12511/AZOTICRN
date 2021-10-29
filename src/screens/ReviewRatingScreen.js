import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

//Icons
import ic_star from '../assets/icons/ic_star.png';
import ic_half_star from '../assets/icons/ic_half_star.png';
import no_star from '../assets/icons/no_star.png';

// Styles
import BasicStyles from '../styles/BasicStyles';

// Components
import HeaderComponent from '../components/HeaderComponent';
import StarRating from 'react-native-star-rating';
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessingLoader';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference

export default class ReviewRatingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      title: '',
      reviews: '',
      showProcessingLoader: false,
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

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  handleRateProduct = async () => {
    const {starCount, reviews} = this.state;

    // validations
    if (starCount === 0) {
      Alert.alert('', 'Please rate product with stars !', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({showProcessingLoader: true});

      const item = this.props.navigation.getParam('item', null);
      if (item) {
        const {orderDetailIdId, productId} = item;

        // Preparing Params
        const params = {
          orderDetailId: orderDetailIdId,
          productId,
          reviews,
          ratings: starCount,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'Customers/addRating',
          params,
          true,
        );

        if (response) {
          const {success, message} = response;

          this.setState({
            showProcessingLoader: false,
          });

          if (success) {
            this.props.navigation.pop();
            showToast(message);
          } else {
            showToast(message);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTitleChange = (changedText) => {
    this.setState({title: changedText});
  };

  handleDescriptionChange = (changedText) => {
    this.setState({reviews: changedText});
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Review"
          navAction="back"
          nav={this.props.navigation}
        />

        <View style={styles.contentContainer}>
          <View style={styles.starContainer}>
            <Text style={styles.RatingTitle}>Rate this Product</Text>
            <View
              style={[BasicStyles.directionRow, BasicStyles.paddingVentricle]}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                fullStar={ic_star}
                halfStar={ic_half_star}
                emptyStar={no_star}
                starSize={25}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                starStyle={styles.stars}
              />
            </View>
          </View>

          <TextInput
            placeholder="Type your Review..."
            style={styles.input}
            placeholderTextColor="#333"
            value={this.state.reviews}
            onChangeText={this.handleDescriptionChange}
            multiline={true}
            numberOfLines={5}
          />

          <TouchableOpacity
            onPress={this.handleRateProduct}
            underlayColor="#00adef80"
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        {this.state.showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  contentContainer: {
    flex: 1,
    padding: wp(3),
  },
  contentTile: {
    paddingHorizontal: wp(3),
    paddingTop: wp(4),
    fontSize: wp(4),
  },
  starContainer: {
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RatingTitle: {
    fontSize: wp(4),
    width: wp(50),
    textAlign: 'center',
  },
  stars: {
    marginHorizontal: wp(1.5),
  },

  inputTitle: {
    backgroundColor: '#fff',
    padding: wp(3),
    color: '#000',
    marginTop: hp(3),
    alignItems: 'center',
    fontSize: wp(3.5),
  },
  input: {
    backgroundColor: '#fff',
    padding: wp(3),
    color: '#000',
    height: hp(20),
    marginTop: hp(1.5),
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    fontSize: wp(3.5),
  },
  submitButton: {
    backgroundColor: '#00adef',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    alignSelf: 'center',
    borderRadius: 4,
    marginTop: hp(3),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(3.5),
  },
});
