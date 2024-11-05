/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PizzaListScreen from '../screen/pizzaListScreen';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={PizzaListScreen} />
        </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

export default DrawerNavigation;
