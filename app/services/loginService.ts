// loginService.ts

import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to install this package
import axios from 'axios';

const API_URL = 'http://192.168.29.69:7000/api/v1/login';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, {
      email,
      password,
    });

    if (!response.data.error) {
      // If login is successful, store the token in local storage
      const { token } = response.data.data;
      await AsyncStorage.setItem('userToken', token);
      return { success: true, data: response.data.data };
    } else {
      // If there's an error, return the message
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
