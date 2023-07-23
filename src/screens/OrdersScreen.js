import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles

// Components
import HeaderComponent from '../components/HeaderComponent';

// Tabs
import OrderCompleteTab from '../screens/OrderCompleteTab';
import OrderPendingTab from '../screens/OrderPendingTab';
import OrderCancelledTab from '../screens/OrderCancelledTab';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'Current',
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

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Current') {
      return <OrderPendingTab navigation={this.props.navigation} />;
    } else if (tabActive === 'Completed') {
      return <OrderCompleteTab navigation={this.props.navigation} />;
    } else if (tabActive === 'Cancelled') {
      return <OrderCancelledTab navigation={this.props.navigation} />;
    }
  };

  handleCurrent = () => {
    this.setState({tabActive: 'Current'});
  };
  handleCompleted = () => {
    this.setState({tabActive: 'Completed'});
  };
  handleCancelled = () => {
    this.setState({tabActive: 'Cancelled'});
  };

  render() {
    const {tabActive} = this.state;

    const activeStyle = [styles.tabStyle, {borderColor: '#f57c00'}];
    const tabActiveText = [styles.tabBarLabel, {color: '#333'}];

    return (
      <SafeAreaView style={[styles.container]}>
        <HeaderComponent
          navAction="back"
          headerTitle="Order History"
          nav={this.props.navigation}
        />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={this.handleCurrent}
            style={tabActive === 'Current' ? activeStyle : styles.tabStyle}>
            <Text
              style={
                tabActive === 'Current' ? tabActiveText : styles.tabBarLabel
              }>
              {' '}
              Current{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleCompleted}
            style={tabActive === 'Completed' ? activeStyle : styles.tabStyle}>
            <Text
              style={
                tabActive === 'Completed' ? tabActiveText : styles.tabBarLabel
              }>
              {' '}
              Completed{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleCancelled}
            style={tabActive === 'Cancelled' ? activeStyle : styles.tabStyle}>
            <Text
              style={
                tabActive === 'Cancelled' ? tabActiveText : styles.tabBarLabel
              }>
              {' '}
              Cancelled{' '}
            </Text>
          </TouchableOpacity>
        </View>

        {this.renderSlots()}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  tabBarStyle: {
    marginBottom: hp(1),
    backgroundColor: '#fff',
    padding: 0,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f1f1',
  },

  // tabBarIndicator: {
  //   backgroundColor: '#f57c00',
  //   padding: 0,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   // height: '100%',
  // },
  // tabContainer: {
  //   backgroundColor: '#fff',
  //   elevation: 0,
  //   flexDirection: 'row',
  //   height: hp(5),
  //   // alignItems: 'center',
  //   justifyContent: 'space-around',
  //   marginBottom: hp(2),
  // },
  tabBarLabel: {
    color: '#bebebe',
    fontSize: wp(3.8),
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    marginBottom: hp(-1.8),
    textAlignVertical: 'center',
  },
  tabBarIndicator: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(1),
    // backgroundColor: '#f57c00',
    // borderWidth: wp(0.5),
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 0,
    flexDirection: 'row',
    height: hp(6.5),
    alignItems: 'center',
  },
  tabStyle: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#fff',
  },
});
