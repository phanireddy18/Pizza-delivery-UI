import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getOrdersHistoryByUserId, Order} from '../services/ordersService';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../../styles/ordersHistory.scss';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRatings, setUserRatings] = useState<{[orderId: string]: number}>(
    {},
  );

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const decodedToken = jwtDecode<CustomJwtPayload>(userToken);
          const userId = decodedToken.userId;
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

  const handleRatingPress = (orderId: string, rating: number) => {
    setUserRatings(prevRatings => ({
      ...prevRatings,
      [orderId]: rating,
    }));
  };

  const renderOrderItem = ({item}: {item: Order}) => (
    <View style={cardStyles.orderCard}>
      <View style={styles.orderDetails}>
        <View style={styles.orderIdStatusRow}>
          <View style={styles.orderIdIconContainer}>
            <FontAwesome name="shopping-bag" size={20} color="#4CAF50" />
            <Text style={styles.orderText}>Order ID: #{item.orderId}</Text>
          </View>
          <View style={styles.statusContainer}>
            <MaterialIcons
              name={
                item.status === 'DELIVERED' ? 'check-circle' : 'hourglass-empty'
              }
              size={16}
              color={item.status === 'DELIVERED' ? '#28a745' : '#ff9800'}
              style={styles.statusIcon}
            />
            <Text
              style={[
                styles.orderStatus,
                item.status === 'DELIVERED' ? styles.delivered : styles.pending,
              ]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Dotted Separator Line */}
        <View style={styles.separatorLine} />

        <View style={styles.ordersData}>
          <Text style={styles.orderText}>Total: ${item.totalPrice}</Text>
          <Text style={styles.orderText}>Address: {item.deliveryAddress}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.separatorLine} />

        {/* Reorder Button and Rating */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.reorderButton}>
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() =>
                  handleRatingPress(item.orderId.toString(), star)
                }>
                <FontAwesome
                  name={
                    star <= (userRatings[item.orderId] || 0) ? 'star' : 'star-o'
                  }
                  size={20}
                  color="#FFD700"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  // const handleRefresh = async () => {
  //   setLoading(true);
  //   const userToken = await AsyncStorage.getItem('userToken');
  //   if (userToken) {
  //     const decodedToken = jwtDecode<CustomJwtPayload>(userToken);
  //     const userId = decodedToken.userId;
  //     const orderHistory = await getOrdersHistoryByUserId(userId);
  //     setOrders(orderHistory.data);
  //   }
  //   setLoading(false);
  // };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color=" #4CAF50" />
        </View>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.orderId.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noOrdersText}>No orders found</Text>
      )}

      {/* <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <MaterialIcons name="refresh" size={24} color="white" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});

export default OrderHistoryScreen;
