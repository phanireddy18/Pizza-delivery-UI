/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/cartScreenStyle.scss';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';

interface Pizza {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
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
  const [cart, setCart] = useState<Pizza[]>([
    {
      id: '1',
      name: 'Margherita',
      price: 10,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Pepperoni',
      price: 12,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      name: 'Veggie Delight',
      price: 15,
      quantity: 1,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

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

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleIncrement = (id: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    );
  };

  const handleDecrement = (id: string) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      ),
    );
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
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

  const renderCartItem = ({item}: {item: Pizza}) => (
    <View style={styles.cartItem}>
      <Image source={{uri: item.imageUrl}} style={styles.pizzaImage} />
      <View style={styles.pizzaDetails}>
        <Text style={styles.pizzaName}>{item.name}</Text>
        <Text style={styles.pizzaPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrement(item.id)}>
            <FontAwesome name="minus-circle" size={20} color="#ff6b6b" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrement(item.id)}>
            <FontAwesome name="plus-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

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
      {cart.length > 0 ? (
        <>
          <View style={styles.cartCard}>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={styles.cartList}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View>
            {/* Offers Section */}
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

          {/* Summary and Buttons */}
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
