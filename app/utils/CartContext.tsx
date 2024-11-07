import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  pizzaId: number;
  name: string;
  price: number;
  imageUrl: string;
  itemTotal: number; // quantity * price
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (pizzaId: number) => void;
  clearCart: () => void;
  updateQuantity: (pizzaId: number, quantity: number) => void; // Add updateQuantity method
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC = ({children}: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from AsyncStorage on app load
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.pizzaId === item.pizzaId,
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity,
          itemTotal:
            updatedCart[existingItemIndex].price *
            (updatedCart[existingItemIndex].quantity + item.quantity),
        };
        return updatedCart;
      } else {
        return [...prevCart, item];
      }
    });
  };

  // Update quantity for a specific item in the cart
  const updateQuantity = (pizzaId: number, quantity: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.pizzaId === pizzaId) {
          return {
            ...item,
            quantity,
            itemTotal: item.price * quantity, // Recalculate item total based on quantity
          };
        }
        return item;
      });
      return updatedCart;
    });
  };

  const removeFromCart = (pizzaId: number) => {
    setCart(prevCart => prevCart.filter(item => item.pizzaId !== pizzaId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{cart, addToCart, removeFromCart, clearCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
};
