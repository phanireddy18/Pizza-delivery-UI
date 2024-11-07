import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import styles from '../../styles/placeOrderScreen.scss';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../type';
import { StackNavigationProp } from '@react-navigation/stack';

export default function PlaceOrderScreen() {
    const navigation =
        useNavigation<StackNavigationProp<RootStackParamList, 'ordersHistory'>>();
    const confettiRef = useRef<any>(null);
    const navigateToOrdersHistory = () => {
        navigation.navigate('ordersHistory');
    }
    return (
        <View style={styles.container}>
            <ConfettiCannon
                ref={confettiRef}
                count={150}
                origin={{ x: -10, y: 0 }}
                fadeOut
                autoStart
                onAnimationEnd={navigateToOrdersHistory}
            />
            <View style={styles.messageContainer}>
                <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
                <Text style={styles.successText}>Your order has been placed successfully!</Text>
            </View>
            {/* <TouchableOpacity style={styles.continueButton} onPress={handleNavigation}>
                <Text style={styles.continueButtonText}>Track Order</Text>
            </TouchableOpacity> */}
        </View>
    );
}
