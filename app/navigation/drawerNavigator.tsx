/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PizzaListScreen from '../screen/pizzaListScreen';
import 'react-native-gesture-handler';
import { Alert, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import globalStyles from '../../styles/globalStyle.scss';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: any) => {
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
      { cancelable: true },
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={PizzaListScreen} 
            options={{
              // eslint-disable-next-line react/no-unstable-nested-components
              drawerIcon: () => <Entypo name="home" size={22} color="#000" />,
              title: 'Home',
            }}/>
        <Drawer.Screen
          name="Logout"
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            drawerIcon: () => <Entypo name="log-out" size={22} color="#000" />,
            title: 'Logout',
            // eslint-disable-next-line react/no-unstable-nested-components
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
