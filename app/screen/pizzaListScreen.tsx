/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/pizzaListScreen.scss';
import {getAllPizzas, Pizza} from '../services/pizzaService';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../type';

const PizzaListScreen = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, 'PizzaListScreen'>>();

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

  const renderPizzaItem = ({item}: {item: Pizza}) => (
    <TouchableOpacity onPress={() => handleSelectPizza(item.pizzaId)}>
      <Card style={styles.card}>
        <Card.Cover source={{uri: item.imageUrl}} style={styles.cardImage} />
        <Card.Content>
          <Title style={styles.cardTitle}>{item.name}</Title>
          <Paragraph style={styles.cardDescription}>
            {item.description}
          </Paragraph>
          <Text style={styles.cardPrice}>${item.price}</Text>
          <Text style={styles.cardSize}>Size: {item.size}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

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

export default PizzaListScreen;
