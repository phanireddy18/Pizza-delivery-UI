import {SCREEN_URL} from '../../environment';
import api from '../utils/interceptors';

// Assuming your order interface looks something like this:
export interface Pizza {
  pizzaId: number;
  pizzaName: string;
  pizzaPrice: string; // or number, depending on how you want to store it
  pizzaQuantity: number;
}

export interface Order {
  orderId: number;
  totalPrice: string; // or number
  deliveryAddress: string;
  createdAt: string; // or Date
  status: string;
  pizzas: Pizza[]; // Array of pizzas
}

export const getOrdersHistoryByUserId = async (
  userId: any,
): Promise<{
  error: boolean;
  message: string;
  data: Order[];
}> => {
  try {
    const response = await api.get(
      `${SCREEN_URL.GET_ORDERS_HISTORY}/${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
