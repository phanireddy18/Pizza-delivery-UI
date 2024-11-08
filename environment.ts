import Config from 'react-native-config';

const BASE_URL = Config.API_URL;

export const AUTHENTICATION_URL = {
  REGISTER_API_URL: `${BASE_URL}/register`,
  LOGIN_API_URL: `${BASE_URL}/login`,
};

export const SCREEN_URL = {
  //Pizza list
  GET_ALL_PIZZAS: `${BASE_URL}/pizzas`,

  //Pizza Details
  GET_PIZZA_DETAILS_BY_ID: `${BASE_URL}/pizzas`,

  //Orders History
  GET_ORDERS_HISTORY: `${BASE_URL}/orders/user`,

    //Place order
  PLACE_ORDERS: `${BASE_URL}/orders`,
};
