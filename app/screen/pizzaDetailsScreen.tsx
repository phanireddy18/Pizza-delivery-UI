import {View, Text} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../type';

type PizzaDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'pizzaDetails'
>;

type PizzaDetailsScreenProps = {
  route: PizzaDetailsScreenRouteProp;
};

const PizzaDetailsScreen = ({route}: PizzaDetailsScreenProps) => {
  const {pizzaId} = route.params;
  return (
    <View>
      <Text>pizzaDetailsScreen{pizzaId}</Text>
    </View>
  );
};

export default PizzaDetailsScreen;
