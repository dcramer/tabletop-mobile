import React from 'react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Activity from './screens/Activity';
import AddBottle from './screens/AddBottle';
import AddDistillery from './screens/AddDistillery';
import CheckIn from './screens/CheckIn';
import CheckInDetails from './screens/CheckInDetails';
import RelationSelect from './screens/RelationSelect';
import FriendSelect from './screens/FriendSelect';
import FindFriends from './screens/FindFriends';
import LocationSelect from './screens/LocationSelect';
import Notifications from './screens/Notifications';
import Home from './screens/Home';
import MyProfile from './screens/MyProfile';
import BottleDetails from './screens/BottleDetails';
import TagSelect from './screens/TagSelect';
import UserProfile from './screens/UserProfile';
import Welcome from './screens/Welcome';

import { colors } from './styles';

const commonOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.trim,
    borderBottomWidth: 1,
  },
  headerTintColor: colors.background,
  headerTitleStyle: {
    color: colors.background,
    fontWeight: 'bold',
  },
};

const HomeStack = createStackNavigator(
  {
    Home,
    BottleDetails,
    CheckInDetails,
    CheckIn,
    AddBottle,
    AddDistillery,
    FindFriends,
    UserProfile,
  },
  {
    navigationOptions: { ...commonOptions },
  }
);

const MainStack = createBottomTabNavigator(
  {
    HomeStack,
    Activity,
    Notifications,
    MyProfile,
  },
  {
    initialRouteName: 'HomeStack',
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      const TabBarIcon = ({ focused, tintColor }) => {
        let iconName;
        if (routeName === 'HomeStack') {
          iconName = `home`;
        } else if (routeName === 'Activity') {
          iconName = `map`;
        } else if (routeName === 'Notifications') {
          iconName = `bell`;
        } else if (routeName === 'MyProfile') {
          iconName = `user`;
        }
        return <Icon name={iconName} size={24} color={tintColor} solid={focused} />;
      };

      TabBarIcon.propTypes = {
        focused: PropTypes.boolean,
        tintColor: PropTypes.string,
      };

      return {
        tabBarIcon: TabBarIcon,
        tabBarOptions: {
          showLabel: false,
          activeTintColor: colors.primary,
          inactiveTintColor: colors.default,
          style: {
            borderTopColor: colors.trim,
            borderTopWidth: 1,
            backgroundColor: colors.background,
          },
        },
        ...commonOptions,
      };
    },
  }
);

export const RootNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    RelationSelect,
    LocationSelect,
    FriendSelect,
    TagSelect,
  },
  {
    mode: 'modal',
    gesturesEnabled: true,
    // XXX(dcramer):
    navigationOptions: ({ navigation }) => {
      let focusedRouteName = idx(navigation, _ => _.state.routes[_.state.index].routeName);
      let { routeName } = navigation.state;
      let header,
        title = null;
      switch (focusedRouteName) {
        case 'Activity':
          title = 'Activity';
          break;
        case 'Notifications':
          title = 'Notifications';
          break;
        case 'HomeStack':
        case 'MyProfile':
        case 'UserProfile':
          header = null;
          break;
      }
      if (routeName == 'UserProfile') {
        header = null;
      }

      return {
        ...commonOptions,
        header,
        title,
        tabBarVisible: navigation.state.index === 0,
      };
    },
  }
);

export const UnauthenticatedNavigator = createStackNavigator(
  {
    Welcome,
  },
  {
    navigationOptions: { ...commonOptions },
  }
);
