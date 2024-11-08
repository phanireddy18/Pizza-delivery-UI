/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
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
import {getAllPizzas, Pizza} from '../services/pizzaService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../styles/pizzaListScreen.scss';
import Cart from './component/Cart';
import {useCart} from '../utils/CartContext';

const PizzaListScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PizzaListScreen'>>();
  const {cart} = useCart();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await getAllPizzas();
        setPizzas(response.data);
      } catch (fetchError) {
        console.error('Failed to fetch pizzas', fetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  // Updated handleRefresh function
  const handleRefresh = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const response = await getAllPizzas();
      setPizzas(response.data);
    } catch (refreshError) {
      console.error('Failed to fetch pizzas', refreshError);
    } finally {
      setLoading(false);
      setRefreshing(false); // End refreshing
    }
  };
  const handleSelectPizza = (pizzaId: number) => {
    navigation.navigate('PizzaDetails', {pizzaId});
  };

  const handleViewCart = () => {
    if (cart.length > 0) {
      navigation.navigate('CartScreen');
    }
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyError}>
      <Text>No pizzas available</Text>
    </View>
  );

  const renderPizzaItem = ({item}: {item: Pizza}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => handleSelectPizza(item.pizzaId)}
      style={cardStyles.card}>
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pizzas}
          renderItem={renderPizzaItem}
          keyExtractor={item => item.pizzaId.toString()}
          contentContainerStyle={[
            styles.pizzaFlatList,
            {paddingBottom: cart.length > 0 ? 70 : 0},
          ]}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
      {cart.length > 0 && (
        <View style={styles.cartContainer}>
          <Cart onViewCart={handleViewCart} />
        </View>
      )}
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
