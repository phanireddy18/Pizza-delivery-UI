/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Title} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/pizzaListScreen.scss';
import {getAllPizzas, Pizza} from '../services/pizzaService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';
import {SafeAreaView} from 'react-native-safe-area-context';
import Cart from './component/Cart';

const PizzaListScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PizzaListScreen'>>();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Track refreshing state

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await getAllPizzas();
        setPizzas(response.data);
      } catch (error) {
        console.error('Failed to fetch pizzas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  // Function to handle refresh
  const handleRefresh = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const response = await getAllPizzas();
      setPizzas(response.data);
    } catch (error) {
      console.error('Failed to fetch pizzas', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing
    }
  };

  // Navigate to Pizza Details screen
  const handleSelectPizza = (pizzaId: number) => {
    navigation.navigate('PizzaDetails', {pizzaId: pizzaId});
  };

  const handleViewCart = () => {
    if (Cart && Cart.length > 0) {
      navigation.navigate('CartScreen');
    }
  };

  const renderPizzaItem = ({item}: {item: Pizza}) => {
    return (
      <TouchableOpacity onPress={() => handleSelectPizza(item.pizzaId)}>
        <View style={cardStyles.card}>
          <View style={styles.cardImageContainer}>
            <Image
              source={{uri: item.imageUrl}}
              style={styles.cardImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.cardContent}>
            <Title style={styles.cardTitle}>{item.name}</Title>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.cardPrice}>${item.price}</Text>
              <Text style={styles.cardSize}>
                Size: <Text style={styles.sizeValue}>{item.size}</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pizzas}
          renderItem={renderPizzaItem}
          keyExtractor={item => item.pizzaId.toString()}
          contentContainerStyle={{paddingBottom: 80}} // Add padding to avoid overlap with the cart
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
      <View>{loading ? '' : <Cart onViewCart={handleViewCart} />}</View>
    </SafeAreaView>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    padding: 10,
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

export default PizzaListScreen;
