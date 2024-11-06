import {SCREEN_URL} from '../../environment';
import api from '../utils/interceptors';

// pizzaService.ts
export interface Pizza {
  pizzaId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  size: string;
}

export const getAllPizzas = async (): Promise<{
  error: boolean;
  message: string;
  data: Pizza[];
}> => {
  try {
    const response = await api.get(`${SCREEN_URL.GET_ALL_PIZZAS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPizzaDetailsById = async (pizzaId: any): Promise<any> => {
  try {
    const response = await api.get(
      `${SCREEN_URL.GET_PIZZA_DETAILS_BY_ID}/${pizzaId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
