/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PizzaListScreen from '../screen/pizzaListScreen';
import 'react-native-gesture-handler';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import globalStyles from '../../styles/globalStyle.scss';
import OrderHistoryScreen from '../screen/orderHistoryScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Drawer = createDrawerNavigator();

const DrawerNavigation = ({navigation}: any) => {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            // Navigate back to the login screen
            await AsyncStorage.removeItem('userToken');
            navigation.dispatch(DrawerActions.closeDrawer());
            navigation.replace('Login');
          },
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen
          name="Home"
          component={PizzaListScreen}
          options={{
            drawerIcon: () => <Entypo name="home" size={22} color="#000" />,
            title: 'Home',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('CartScreen')}
                style={{marginRight: 15}}>
                <Ionicons name="bag" size={24} color="#a2aa42" />
              </TouchableOpacity>
            ),
          }}
        />

        <Drawer.Screen
          name="ordersHistory"
          component={OrderHistoryScreen}
          options={{
            drawerIcon: () => <Entypo name="list" size={22} color="#000" />,
            title: 'Your orders',
          }}
        />
        <Drawer.Screen
          name="Logout"
          options={{
            drawerIcon: () => (
              <AntDesign name="logout" size={22} color="#000" />
            ),
            title: 'Logout',
            drawerLabel: () => (
              <View style={globalStyles.logout_container}>
                <Text style={globalStyles.drawer_text}>Logout</Text>
              </View>
            ),
          }}
          listeners={{
            drawerItemPress: e => {
              e.preventDefault(); // Prevent the default navigation
              handleLogout(); // Invoke the logout function
            },
          }}>
          {() => null}
        </Drawer.Screen>
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

export default DrawerNavigation;
