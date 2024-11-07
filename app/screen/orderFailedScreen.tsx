import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../type';
import styles from '../../styles/orderFailedScreen.scss';

export default function OrderFailedScreen() {
  const [timer, setTimer] = useState(5);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CartScreen'>>();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {


    // Countdown Timer
    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          setTimeout(() => navigation.navigate('CartScreen'), 500); // Navigate after delay
        }
        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(countdown);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Message */}
      <View style={[styles.messageContainer]}>
        <Text style={styles.messageText}>Oops! Something went wrong</Text>
      </View>

      {/* "Try again" message */}
      <Text style={styles.paraText}>Please try again later</Text>

      {/* Timer */}
      <View style={[styles.timerContainer]}>
        <Text style={styles.timerText}>Redirecting in {timer}s...</Text>
      </View>
    </View>
  );
}

