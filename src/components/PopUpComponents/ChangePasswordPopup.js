import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Images
import your_story from '../../assets/images/your_story.png';
import ic_edit from '../../assets/icons/ic_edit.png';

export default class ChangePasswordPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setViewRef = (ref) => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = (event) => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleApply = () => {
    this.props.closePopup();
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <ScrollView>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.textAlign,
                basicStyles.marginBottom,
              ]}>
              Change Password
            </Text>

            <View>
              <Text>Present Password</Text>
              <TextInput
                placeholder="*****"
                placeholderTextColor="#333"
                style={styles.input}
              />
            </View>

            <View>
              <Text>New Password</Text>
              <TextInput
                placeholder="*****"
                placeholderTextColor="#333"
                style={styles.input}
              />
            </View>

            <View>
              <Text>Confirm Password</Text>
              <TextInput
                placeholder="*****"
                placeholderTextColor="#333"
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  popupContainer: {
    width: wp(100),
    backgroundColor: 'white',
    padding: wp(5),
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  profileView: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(14),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userImage: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(12.5),
  },
  halfCircle: {
    backgroundColor: '#3338',
    height: wp(14),
    width: wp(28),
    position: 'absolute',
    bottom: wp(-0.5),
    borderBottomLeftRadius: wp(14),
    borderBottomRightRadius: wp(14),
    left: wp(-0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  input: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(5.5),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    backgroundColor: '#ccc4',
  },
  inputBig: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    height: hp(10),
    fontSize: wp(3.5),
    marginTop: wp(2),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginBottom: hp(2),
    textAlignVertical: 'top',
    backgroundColor: '#ccc4',
  },
  button: {
    backgroundColor: '#F57C00',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
