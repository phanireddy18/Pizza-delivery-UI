import { SCREEN_URL } from '../../environment';
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

interface PizzaDetails {
  pizzaId: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  size: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  longDescription:string;
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

export const getPizzaDetailsById = async (pizzaId: number): Promise<PizzaDetails> => {
  try {
    const response = await api.get(`${SCREEN_URL.GET_PIZZA_DETAILS_BY_ID}/${pizzaId}`);
    return response.data.data; // Adjust if API response structure differs
  } catch (error) {
    console.error('Error fetching pizza details:', error);
    throw error;
  }
};
