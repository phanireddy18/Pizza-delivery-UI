import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './app/navigation/mainNavigator';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;
