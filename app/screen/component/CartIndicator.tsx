/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCart} from '../../utils/CartContext';

const CartIconWithIndicator = () => {
  const {cart} = useCart();

  return (
    <View style={{position: 'relative', padding: 10}}>
      <Ionicons name="bag" size={24} color="#a2aa42" />
      {cart.length > 0 && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            backgroundColor: '#a2aa42',
            borderRadius: 8,
            width: 15,
            height: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 10}}>{cart.length}</Text>
        </View>
      )}
    </View>
  );
};

export default CartIconWithIndicator;
