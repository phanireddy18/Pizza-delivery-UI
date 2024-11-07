/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Button,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../type';
import {getPizzaDetailsById} from '../services/pizzaService';
import styles from '../../styles/pizzaDetailsScreen.scss';
import RenderHTML from 'react-native-render-html';
import Cart from './component/Cart';
import {useCart} from '../utils/CartContext';
import {StackNavigationProp} from '@react-navigation/stack';

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
  longDescription: string;
}

type PizzaDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'PizzaDetails'
>;

type PizzaDetailsScreenProps = {route: PizzaDetailsScreenRouteProp};
type CartScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CartScreen'
>;

const PizzaDetailsScreen = ({route}: PizzaDetailsScreenProps) => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const {pizzaId} = route.params;
  const {cart, addToCart, removeFromCart} = useCart();
  const [pizzaDetails, setPizzaDetails] = useState<PizzaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemCount, setItemCount] = useState<number>(0);

  const fetchPizzaDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPizzaDetailsById(pizzaId);
      setPizzaDetails(data);
    } catch (err) {
      setError('Failed to load pizza details');
      console.error('Error fetching pizza details:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pizzaId]);

  useEffect(() => {
    fetchPizzaDetails();
  }, [fetchPizzaDetails]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPizzaDetails();
  };
  const handleAddToCart = () => {
    if (pizzaDetails) {
      const cartItem = {
        pizzaId: pizzaDetails.pizzaId,
        name: pizzaDetails.name,
        price: parseFloat(pizzaDetails.price),
        imageUrl: pizzaDetails.imageUrl, // This is the important part
        quantity: 1,
        itemTotal: parseFloat(pizzaDetails.price), // Set initial item total as price
      };

      console.log('Adding to cart: ', cartItem); // Log cart item to check imageUrl

      addToCart(cartItem);
    }
  };

  const handleRemoveFromCart = () => {
    if (!pizzaDetails) {
      return;
    } // Ensure pizzaDetails is not null

    if (itemCount > 1) {
      addToCart({
        pizzaId: pizzaDetails.pizzaId,
        name: pizzaDetails.name,
        price: parseFloat(pizzaDetails.price),
        imageUrl: pizzaDetails.imageUrl,
        quantity: -1,
        itemTotal: 0, // You can calculate this correctly in the cart logic
      });
    } else {
      removeFromCart(pizzaDetails.pizzaId);
    }
  };

  useEffect(() => {
    const cartItem = cart.find(item => item.pizzaId === pizzaId);
    setItemCount(cartItem ? cartItem.quantity : 0);
  }, [cart, pizzaId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (!pizzaDetails) {
    return null;
  }

  const handleViewCart = () => {
    // Navigate to the cart screen or perform any action
    console.log('View Cart Pressed');
    navigation.navigate('CartScreen');
  };

  return (
    <ScrollView
      contentContainerStyle={{alignItems: 'flex-start', padding: 20}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Existing Components */}

      <Image source={{uri: pizzaDetails.imageUrl}} style={styles.image} />
      <Text style={styles.name}>{pizzaDetails.name}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${pizzaDetails.price}</Text>
        {itemCount === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={handleRemoveFromCart}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.itemCount}>{itemCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={handleAddToCart}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.descriptionContainer}
        showsVerticalScrollIndicator={false}>
        <RenderHTML
          contentWidth={300}
          source={{html: pizzaDetails?.longDescription}}
          tagsStyles={{
            p: {fontSize: 16, color: '#333'},
            h1: {fontSize: 22, fontWeight: 'bold'},
            h2: {fontSize: 20, fontWeight: 'bold'},
          }}
        />
      </ScrollView>

      {/* <Cart onViewCart={() => navigation.navigate('CartScreen')} /> */}
      <Cart onViewCart={handleViewCart} />
    </ScrollView>
  );
};

export default PizzaDetailsScreen;
