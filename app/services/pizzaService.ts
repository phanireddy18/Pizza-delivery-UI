import axios from 'axios';
import {SCREEN_URL} from '../../environment';

export const getAllPizzas = async (): Promise<any> => {
  try {
    const response = await axios.get(`${SCREEN_URL.GET_ALL_PIZZAS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPizzaDetailsById = async (pizzaId: any): Promise<any> => {
  try {
    const response = await axios.get(
      `${SCREEN_URL.GET_PIZZA_DETAILS_BY_ID}/${pizzaId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
