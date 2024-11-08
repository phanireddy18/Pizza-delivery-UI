import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../services/NavigationService'; // Import the navigate function
import Config from 'react-native-config';

const api = axios.create({
  baseURL: Config.API_URL,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized - Token might be invalid');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.getItem('cart');

      // Navigate to Login screen
      navigate('Login');

      return Promise.reject({...error, status: 401});
    }

    return Promise.reject(error);
  },
);

export default api;
