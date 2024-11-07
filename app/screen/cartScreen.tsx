/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/cartScreenStyle.scss';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';
import {useCart} from '../utils/CartContext';

interface cartPizzas {
  imageUrl: string;
  itemTotal: number;
  name: string;
  pizzaId: number;
  price: number;
  quantity: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
}

const CartScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // const {cart, addToCart, removeFromCart} = useCart();

  const {cart, updateQuantity} = useCart();

  const [cartItems, setCartItems] = useState<cartPizzas[]>(cart);

  // Offer list as a constant since it’s not modified
  const offers: Offer[] = [
    {
      id: 'offer1',
      title: '10% Off',
      description: 'Get 10% off on your order',
      discountPercentage: 10,
    },
    {
      id: 'offer2',
      title: 'Free Delivery',
      description: 'Free delivery on orders above $20',
      discountPercentage: 0,
    },
    {
      id: 'offer3',
      title: 'Buy 1 Get 1 Free',
      description: 'Buy 1 pizza, get another one for free',
      discountPercentage: 50,
    },
    {
      id: 'offer4',
      title: '10% Cashback',
      description: 'Get 10% cashback on your next order',
      discountPercentage: 10,
    },
    {
      id: 'offer5',
      title: 'Free Drink',
      description: 'Get a free drink with any pizza order above $15',
      discountPercentage: 0,
    },
    {
      id: 'offer6',
      title: 'Weekend Special',
      description: 'Get 15% off on all orders on weekends',
      discountPercentage: 15,
    },
  ];

  const handleIncrement = (item: cartPizzas) => {
    // Only update the quantity here, without calling addToCart
    setCartItems(prevCart =>
      prevCart.map(cartItem =>
        cartItem.pizzaId === item.pizzaId
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem,
      ),
    );
    handleQuantityChange(item.pizzaId, item.quantity + 1);
  };

  const handleDecrement = (item: cartPizzas) => {
    // Only update the quantity here, without calling addToCart
    setCartItems(prevCart =>
      prevCart.map(cartItem =>
        cartItem.pizzaId === item.pizzaId && cartItem.quantity > 1
          ? {...cartItem, quantity: cartItem.quantity - 1}
          : cartItem,
      ),
    );
    handleQuantityChange(item.pizzaId, item.quantity - 1);
  };

  const handleQuantityChange = (pizzaId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }
    updateQuantity(pizzaId, newQuantity);
  };

  // Calculate totals
  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const discount = selectedOffer
      ? subtotal * (selectedOffer.discountPercentage / 100)
      : 0;
    const cgst = (subtotal - discount) * 0.05;
    const sgst = (subtotal - discount) * 0.05;
    const total = subtotal - discount + cgst + sgst;

    return {subtotal, cgst, sgst, discount, total};
  };

  const {subtotal, cgst, sgst, discount, total} = calculateTotal();

  // Render Cart Item
  const renderCartItem = ({item}: {item: cartPizzas}) => (
    <View style={styles.cartItem}>
      <Image source={{uri: item.imageUrl}} style={styles.pizzaImage} />
      <View style={styles.pizzaDetails}>
        <Text style={styles.pizzaName}>{item.name}</Text>
        <Text style={styles.pizzaPrice}>${item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrement(item)}>
            <FontAwesome name="minus-circle" size={20} color="#ff6b6b" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrement(item)}>
            <FontAwesome name="plus-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  // Render Offer
  const renderOffer = ({item}: {item: Offer}) => (
    <TouchableOpacity
      style={[
        styles.offerCard,
        selectedOffer?.id === item.id && styles.selectedOfferCard,
      ]}
      onPress={() => setSelectedOffer(item)}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
      <Text style={styles.offerDiscount}>Save {item.discountPercentage}%</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <View style={styles.cartCard}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={item =>
                item.pizzaId
                  ? item.pizzaId.toString()
                  : `${item.name}-${Math.random()}`
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.cartList}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View>
            <Text style={styles.offersHeading}>Available Offers</Text>
            <FlatList
              data={offers}
              renderItem={renderOffer}
              keyExtractor={item => item.id}
              horizontal
              contentContainerStyle={styles.offersContainer}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              {selectedOffer && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Discount:</Text>
                  <Text style={styles.summaryValue}>
                    -${discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>CGST (5%):</Text>
                <Text style={styles.summaryValue}>${cgst.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>SGST (5%):</Text>
                <Text style={styles.summaryValue}>${sgst.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty!</Text>
          <TouchableOpacity
            style={styles.selectItemsButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.selectItemsButtonText}>Select Items</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
