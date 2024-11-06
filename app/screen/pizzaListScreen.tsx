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

const PizzaListScreen = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PizzaListScreen'>>();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleSelectPizza = (pizzaId: number) => {
    navigation.navigate('pizzaDetails', {pizzaId: pizzaId});
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={pizzas}
          renderItem={renderPizzaItem}
          keyExtractor={item => item.pizzaId.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
