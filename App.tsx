/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PizzaListScreen from './app/screen/pizzaListScreen';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={PizzaListScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
