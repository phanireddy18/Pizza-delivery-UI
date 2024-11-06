import {SCREEN_URL} from '../../environment';
import api from '../utils/interceptors';

export interface Order {
  orderId: number;
  userId: number;
  totalPrice: string;
  deliveryAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
