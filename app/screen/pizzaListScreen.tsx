// app/screen/pizzaListScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PizzaListScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Pizza List Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PizzaListScreen;
