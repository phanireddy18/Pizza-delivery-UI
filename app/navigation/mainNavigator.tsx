// src/navigation/MainNavigator.tsx
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screen/loginScreen';
import RegistrationScreen from '../screen/registrationscreen';
import DrawerNavigation from './drawerNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Drawer: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  const [initialRoute, setInitialRoute] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('MainNavigator useEffect triggered');
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token from AsyncStorage:', token);
        if (token) {
          setInitialRoute('Drawer'); // Set to 'Drawer' if token exists
          console.log('Navigating to Drawer');
        } else {
          setInitialRoute('Login'); // Set to 'Login' if no token exists
          console.log('Navigating to Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setInitialRoute('Login'); // Default to Login if error occurs
      }
    };

    checkToken();
  }, []);

  if (initialRoute === undefined) {
    // Optionally return a loading indicator here while checking the token
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator  initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
