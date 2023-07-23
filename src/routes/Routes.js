import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Customer Screens
import HomeScreen from '../screens/HomeScreen';
import InitialLocationScreen from '../screens/InitialLocationScreen';
import SignupScreen from '../screens/SignupScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import UserLoginScreen from '../screens/UserLoginScreen';
import OtpScreen from '../screens/OtpScreen';
import CusVendorsPage from '../screens/CusVendorsPage';
import GalleryDetailScreen from '../screens/GalleryDetailScreen';
import CusFarmsPage from '../screens/CusFarmsPage';
import NotificationScreen from '../screens/NotificationScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import SelectAddressScreen from '../screens/SelectAddressScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import AddressBookScreen from '../screens/AddressBookScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FavoriteOrderScreen from '../screens/FavoriteOrderScreen';
import ContactScreen from '../screens/ContactScreen';
import NewsFeedsTab from '../screens/CustomerHomeTabs/NewsFeedsTab';
import AddCommentScreen from '../screens/AddCommentScreen';
import ViewLikesScreen from '../screens/ViewLikesScreen';
import LiveTab from '../screens/CustomerHomeTabs/LiveTab';
import VendorsTab from '../screens/CustomerHomeTabs/VendorsTab';
import FarmFreshTab from '../screens/CustomerHomeTabs/FarmFreshTab';
import SearchScreen from '../screens/SearchScreen';
import ReviewRatingScreen from '../screens/ReviewRatingScreen';
import SearchAddress from '../screens/SearchAddress';
import OrderTrackScreen from '../screens/OrderTrackScreen';
import LikesScreen from '../screens/LikesScreen';
import VendorRecommendationScreen from '../screens/VendorRecommendationScreen';
import CommentUserDetailScreen from '../screens/CustomerHomeTabs/CommentUserDetailScreen';
import CurrentLocation from '../screens/ChangeCurrentLocation';
import PromoCodeScreen from '../screens/PromoCodeScreen';

const HomeNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    // NewsFeeds: NewsFeedsTab,
    Comment: AddCommentScreen,
    Likes: LikesScreen,
    CuVendors: CusVendorsPage,
    GalleryDetail: GalleryDetailScreen,
    CuFarms: CusFarmsPage,
    Notification: NotificationScreen,
    Cart: CartScreen,
    AddressBook: AddressBookScreen,
    SearchAddress: SearchAddress,
    AddAddress: AddAddressScreen,
    MyAccount: MyAccountScreen,

    CommentUserDetail: CommentUserDetailScreen,
    CurrentLocation,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

const LiveNavigator = createStackNavigator(
  {
    Live: LiveTab,
    Comment: AddCommentScreen,
    Likes: ViewLikesScreen,
    CuVendors: CusVendorsPage,
    CuFarms: CusFarmsPage,
    Notification: NotificationScreen,
    Cart: CartScreen,
    MyAccount: MyAccountScreen,
  },
  {
    initialRouteName: 'Live',
    headerMode: 'none',
  },
);

const VendorsNavigator = createStackNavigator(
  {
    Food: VendorsTab,
    CuVendors: CusVendorsPage,
    Comment: AddCommentScreen,
    Likes: ViewLikesScreen,
    Notification: NotificationScreen,
    Cart: CartScreen,
    MyAccount: MyAccountScreen,
  },
  {
    initialRouteName: 'Food',
    headerMode: 'none',
  },
);

const FarmsNavigator = createStackNavigator(
  {
    Fresh: FarmFreshTab,
    CuFarms: CusFarmsPage,
    Comment: AddCommentScreen,
    Likes: ViewLikesScreen,
    Notification: NotificationScreen,
    Cart: CartScreen,
    MyAccount: MyAccountScreen,
  },
  {
    initialRouteName: 'Fresh',
    headerMode: 'none',
  },
);

const CartNavigator = createStackNavigator(
  {
    Cart: CartScreen,
    PromoCode: PromoCodeScreen,
    Checkout: CheckoutScreen,
    Payment: PaymentScreen,
    SelectAddress: SelectAddressScreen,
    SearchAddress: SearchAddress,
    AddAddress: AddAddressScreen,
    ConfirmOrder: ConfirmScreen,
  },
  {
    initialRouteName: 'Cart',
    headerMode: 'none',
  },
);

// const ConfirmNavigator = createStackNavigator(
//   {
//     Confirm: ConfirmScreen,
//   },
//   {
//     initialRouteName: 'Confirm',
//     headerMode: 'none',
//   },
// );

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
    OrderDetail: OrderDetailScreen,
    ReviewRating: ReviewRatingScreen,
    OrderTrack: OrderTrackScreen,
  },
  {
    initialRouteName: 'Orders',
    headerMode: 'none',
  },
);

const AddressNavigator = createStackNavigator(
  {
    AddressBook: AddressBookScreen,
    SearchAddress: SearchAddress,
    AddAddress: AddAddressScreen,
  },
  {
    initialRouteName: 'AddressBook',
    headerMode: 'none',
  },
);

const AccountNavigator = createStackNavigator(
  {
    MyAccount: MyAccountScreen,

    OrdersNav: OrdersNavigator,
    AddressNav: AddressNavigator,
    FavoriteOrder: FavoriteOrderScreen,
    Contact: ContactScreen,
    Notification: NotificationScreen,
  },
  {
    initialRouteName: 'MyAccount',
    headerMode: 'none',
  },
);

const SearchNavigator = createStackNavigator(
  {
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Search',
    headerMode: 'none',
  },
);

const RegistrationNavigator = createStackNavigator(
  {
    Login: UserLoginScreen,
    SignUp: SignupScreen,
    Otp: OtpScreen,
    VendorRecommendation: VendorRecommendationScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

const CustomerLoggedOutNavigator = createSwitchNavigator(
  {
    NewsNav: HomeNavigator,
    Live: LiveNavigator,
    Food: VendorsNavigator,
    Fresh: FarmsNavigator,
    CartNav: CartNavigator,
    SearchNav: SearchNavigator,
    Register: RegistrationNavigator,
  },
  {
    initialRouteName: 'NewsNav',
    headerMode: 'none',
  },
);

const CustomerLoggedInNavigator = createSwitchNavigator(
  {
    NewsNavS: HomeNavigator,
    Live: LiveNavigator,
    Food: VendorsNavigator,
    Fresh: FarmsNavigator,
    CartNav: CartNavigator,
    AccountNav: AccountNavigator,
    SearchNav: SearchNavigator,
    Register: RegistrationNavigator,
  },
  {
    initialRouteName: 'NewsNavS',
    headerMode: 'none',
  },
);

const InitialLocationNavigator = createStackNavigator(
  {
    InitialLocation: InitialLocationScreen,
    // SelectLocation: CurrentLocation,
  },
  {
    initialRouteName: 'InitialLocation',
    headerMode: 'none',
  },
);

export const createRootNavigator = (userInfo, locationCoords) => {
  const ROUTES = {
    LoggedIn: CustomerLoggedInNavigator,
    LoggedOut: CustomerLoggedOutNavigator,
    InitialSetup: InitialLocationNavigator,
  };

  let initialRouteName = 'InitialSetup';

  if (locationCoords) {
    if (userInfo) {
      initialRouteName = 'LoggedIn';
    } else {
      initialRouteName = 'LoggedOut';
    }
  }

  return createSwitchNavigator(ROUTES, {initialRouteName});
};
