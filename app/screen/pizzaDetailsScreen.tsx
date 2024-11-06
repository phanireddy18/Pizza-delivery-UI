import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Button, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../type';
import { getPizzaDetailsById } from '../services/pizzaService';
import styles from '../../styles/pizzaDetailsScreen.scss';
import RenderHTML from 'react-native-render-html';
import Entypo from 'react-native-vector-icons/Entypo';

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
type PizzaDetailsScreenProps = { route: PizzaDetailsScreenRouteProp };

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

  const handleAddItem = () => setItemCount((prevCount) => prevCount + 1);
  const handleRemoveItem = () => setItemCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));

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
    <ScrollView

      contentContainerStyle={{ alignItems: 'flex-start', padding: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      scrollEnabled={true} // Ensure scrollView registers pull-down refresh from the top
    >
      {/* <View    style={styles.container} > */}
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
            <TouchableOpacity style={styles.counterButton} onPress={handleAddItem}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView} // Height and width control for ScrollView itself
        contentContainerStyle={styles.descriptionContainer} // Content styling
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar (if any)
      >
        import RenderHTML from 'react-native-render-html';

        <RenderHTML
          contentWidth={300} // Adjust according to your screen width or container size
          source={{ html: pizzaDetails?.longDescription }}
          tagsStyles={{
            p: {
              fontSize: 16,  // Increase font size for <p> elements (for paragraphs)
              color: '#333',  // Optional: change text color
            },
            h1: {
              fontSize: 22,  // Increase font size for <h1> headings
              fontWeight: 'bold',  // Optional: style headings
            },
            h2: {
              fontSize: 20,  // Style <h2> heading
              fontWeight: 'bold',
            },
            // Add more tag styles if necessary
          }}
        />

      </ScrollView>


      {itemCount > 0 && (
        <View style={styles.cartCard}>
          <View style={styles.cartCardContent}>
            <Text style={styles.cartText}>Total Items: {itemCount}</Text>
            <TouchableOpacity style={styles.viewCartButton}>
              <Text style={styles.viewCartButtonText}>View Cart
                <Entypo name="chevron-thin-right" size={16} color="#fff" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* </View> */}
    </ScrollView>
  );
};

export default PizzaDetailsScreen;
