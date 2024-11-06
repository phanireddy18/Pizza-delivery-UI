import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getOrdersHistoryByUserId, Order} from '../services/ordersService';
import {jwtDecode} from 'jwt-decode';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/ordersHistory.scss';

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');

        if (userToken) {
          const decodedToken: any = jwtDecode(userToken);
          // const userId = decodedToken.userId;
          const userId = 1;

          const orderHistory = await getOrdersHistoryByUserId(userId);
          setOrders(orderHistory.data);
        } else {
          console.log('No user token found');
        }
      } catch (error) {
        console.error('Failed to fetch order history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const renderOrderItem = ({item}: {item: Order}) => (
    <View style={styles.orderCard}>
      <FontAwesome name="shopping-bag" size={20} color="#333" />
      <Text style={styles.orderText}>Order ID: {item.orderId}</Text>
      <MaterialIcons
        name="verified"
        size={20}
        color={item.status === 'Delivered' ? 'green' : 'orange'}
      />
      <Text style={styles.orderText}>Status: {item.status}</Text>
      <Text style={styles.orderText}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.orderText}>Address: {item.deliveryAddress}</Text>
      <Text style={styles.orderText}>
        Created At: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  const handleRefresh = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      const decodedToken: any = jwtDecode(userToken);
      // const userId = decodedToken.userId;
      const userId = 1;

      const orderHistory = await getOrdersHistoryByUserId(userId);
      setOrders(orderHistory.data);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderId.toString()}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found</Text>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <MaterialIcons name="refresh" size={24} color="white" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderHistoryScreen;
