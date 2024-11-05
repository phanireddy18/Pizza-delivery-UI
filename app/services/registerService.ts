// services/apiService.ts
import axios from 'axios';
import {AUTHENTICATION_URL} from '../../environment';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const registerService = async (data: RegisterData): Promise<any> => {
  console.log('register data------>', data);

  try {
    const response = await axios.post(
      `${AUTHENTICATION_URL.REGISTER_API_URL}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
