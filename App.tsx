import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './app/navigation/mainNavigator';
import 'react-native-gesture-handler';
import { CartProvider } from './app/utils/CartContext';
import Config from 'react-native-config';

const App = () => { 
  console.log('API_URL:', Config.API_URL);
  return (
    <CartProvider>
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
    </CartProvider>
  );
};

export default App;
