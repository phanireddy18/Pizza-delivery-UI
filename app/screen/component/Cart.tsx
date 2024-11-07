import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useCart} from '../../utils/CartContext'; // Import useCart hook
import styles from '../../../styles/cart.scss';

const Cart = ({onViewCart}: {onViewCart: () => void}) => {
  const {cart} = useCart();
console.log('smallll  Cart data:################', cart);
  // Calculate the number of objects (items) in the cart
  const numberOfItems = cart.length;


  if (numberOfItems === 0) {
    return null;
  }

  return (
    <View style={styles.cartCard}>
      <View style={styles.cartCardContent}>
        <Text style={styles.cartText}>Total Items: {numberOfItems}</Text>
        <TouchableOpacity style={styles.viewCartButton} onPress={onViewCart}>
          <Text style={styles.viewCartButtonText}>
            View Cart
            <Entypo name="chevron-thin-right" size={16} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
