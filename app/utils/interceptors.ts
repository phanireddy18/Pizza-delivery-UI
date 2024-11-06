import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://192.168.29.69:7000/api/v1/',
});

// Add request interceptor to include the token in the Authorization header
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

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  response => {
    return response; // Return response if successful
  },
  async error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized errors
      console.error('Unauthorized - Token might be invalid');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userId');

      // Notify the calling component to handle navigation
      return Promise.reject({...error, status: 401});
    }

    return Promise.reject(error);
  },
);

export default api;
