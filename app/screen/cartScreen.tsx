/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/cartScreenStyle.scss';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';
import {useCart} from '../utils/CartContext';
import {placeOrder} from '../services/ordersService';
import ConfirmationDialog from './component/ConfirmationDialog';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressComponent from './component/AddressComponent';

interface CustomJwtPayload extends JwtPayload {
  address: string;
}

interface CartPizza {
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
  const {cart, updateQuantity, removeFromCart, clearCart} = useCart();

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartPizza | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string | null>(null); // State to store the address

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const decodedToken = jwtDecode<CustomJwtPayload>(userToken);
          const address = decodedToken.address;
          setDeliveryAddress(address); // Set the address in state
        } else {
          console.log('No user token found');
        }
      } catch (error) {
        console.error('Failed to fetch order history', error);
      }
    };
    fetchOrderHistory();
  }, [deliveryAddress]);

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

  const handleIncrement = (item: CartPizza) =>
    updateQuantity(item.pizzaId, item.quantity + 1);

  const handleDecrement = (item: CartPizza) => {
    if (item.quantity === 1) {
      setItemToRemove(item);
      setShowRemoveDialog(true);
    } else {
      updateQuantity(item.pizzaId, item.quantity - 1);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.pizzaId);
      setShowRemoveDialog(false);
      setItemToRemove(null); // Reset itemToRemove
    }
  };

  const handleOrder = async () => {
    const orderPayload = {
      pizzaItems: cart.map(item => ({
        pizzaId: item.pizzaId,
        quantity: item.quantity,
      })),
      // deliveryAddress: '123 Pizza Street, Foodtown', // Hardcoded for now
      deliveryAddress: deliveryAddress || 'No address available', // Use the fetched address or fallback message
    };

    try {
      const response = await placeOrder(orderPayload);
      clearCart(); // Clear cart in context
      navigation.navigate('PlaceOrderScreen', {orderId: response.orderId});
    } catch (error: any) {
      console.error('Order Failed:', error);
      navigation.navigate('OrderFailedScreen');
    }
  };
  // Calculate totals
  const handleCancelRemove = () => {
    setShowRemoveDialog(false);
    setItemToRemove(null); // Reset itemToRemove
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

  const renderCartItem = ({item}: {item: CartPizza}) => (
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

  const renderOffer = ({item}: {item: Offer}) => (
    <TouchableOpacity
      style={[
        offerCardStyles.offerCard,
        selectedOffer?.id === item.id && offerCardStyles.selectedOfferCard,
      ]}
      onPress={() => setSelectedOffer(item)}>
      <LinearGradient
        colors={['#f8cdda', '#966e2e']}
        style={offerCardStyles.cardGradient}>
        <View style={offerCardStyles.iconContainer}>
          <Icon
            name={item.discountPercentage > 0 ? 'pricetag' : 'gift'}
            size={20}
            color={selectedOffer?.id === item.id ? '#a51919' : '#ff6347'}
          />
        </View>
        <View style={offerCardStyles.textContainer}>
          <Text style={offerCardStyles.offerTitle}>{item.title}</Text>
          <Text style={offerCardStyles.offerDescription}>
            {item.description}
          </Text>
          <Text style={offerCardStyles.offerDiscount}>
            Save {item.discountPercentage}%
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  return (
    <View style={styles.cartCard}>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.pizzaId.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.separator} />
          <View>
            {deliveryAddress && (
              <AddressComponent deliveryAddress={deliveryAddress} />
            )}
            <View style={styles.separator} />

            <View style={styles.offersContentContainer}>
              <Text style={styles.offersHeading}>Offers</Text>
              <FlatList
                data={offers}
                renderItem={renderOffer}
                keyExtractor={item => item.id}
                horizontal
                contentContainerStyle={styles.offersContainer}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.bottomContainer}>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>
                    ${subtotal.toFixed(2)}
                  </Text>
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
                <TouchableOpacity
                  style={styles.orderButton}
                  onPress={handleOrder}>
                  <Text style={styles.orderButtonText}>Place Order</Text>
                </TouchableOpacity>
              </View>
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

      <ConfirmationDialog
        visible={showRemoveDialog}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        message="Are you sure you want to remove this item from your cart?"
        title={''}
      />
    </View>
  );
};

const offerCardStyles = StyleSheet.create({
  offerCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // The gradient will be applied here:
  cardGradient: {
    padding: 16,
    flex: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOfferCard: {
    borderColor: '#a51919',
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    padding: 8,
  },
  textContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  offerDescription: {
    fontSize: 14,
    color: '#555',
  },
  offerDiscount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e3938',
  },
});

export default CartScreen;
