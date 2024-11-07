import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './app/navigation/mainNavigator';
import 'react-native-gesture-handler';
import { CartProvider } from './app/utils/CartContext';

const App = () => {
  return (
    <CartProvider>
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
    </CartProvider>
  );
};

export default App;
