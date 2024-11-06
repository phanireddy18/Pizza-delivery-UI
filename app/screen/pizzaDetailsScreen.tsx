import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Button, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../type';
import { getPizzaDetailsById } from '../services/pizzaService';
import styles from '../../styles/pizzaDetailsScreen.scss';
import RenderHTML from 'react-native-render-html';

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

type PizzaDetailsScreenRouteProp = RouteProp<RootStackParamList, 'pizzaDetails'>;

type PizzaDetailsScreenProps = {
  route: PizzaDetailsScreenRouteProp;
};

const PizzaDetailsScreen = ({ route }: PizzaDetailsScreenProps) => {
  const navigation = useNavigation();
  const { pizzaId } = route.params;
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

  const handleAddItem = () => setItemCount(itemCount + 1);
  const handleRemoveItem = () => setItemCount(itemCount > 0 ? itemCount - 1 : 0);
  const handleIncreaseItem = () => setItemCount(itemCount + 1);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;
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
  return (
  
    <View style={styles.container}>
      <Image source={{ uri: pizzaDetails.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{pizzaDetails.name}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${pizzaDetails.price}</Text>
        {itemCount === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterButton} onPress={handleRemoveItem}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.itemCount}>{itemCount}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={handleIncreaseItem}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView style={styles.description_container}  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <RenderHTML
          contentWidth={300}
          source={{ html: pizzaDetails.longDescription }}
        />
      </ScrollView>

      {/* Cart Card */}
      {itemCount > 0 && (
        <View style={styles.cartCard}>
          <View style={styles.cartCardContent}>
            <Text style={styles.cartText}>Total Items: {itemCount}</Text>
            <TouchableOpacity
              style={styles.viewCartButton}
            // onPress={() => navigation.navigate('Cart')}
            >
              <Text style={styles.viewCartButtonText}>View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PizzaDetailsScreen;
