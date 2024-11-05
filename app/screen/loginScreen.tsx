import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from '../../styles/loginScreen.scss';
import { RootStackParamList } from '../navigation/MainNavigator';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { validateEmail, validatePassword } from '../utils/authUtils';
import { loginUser } from '../services/loginService';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // State for error messages
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    let valid = true;

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError(null);
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    } else {
      setPasswordError(null);
    }

    // If valid, show success alert and navigate to Register screen
    if (valid) {
      const result = await loginUser(email, password);
      if (result.success) {
        // Handle successful login (e.g., navigate to home screen)
        console.log('Login successful:', result.data);
        Alert.alert('Success', 'Login successful', [
          {
            text: 'OK', onPress: () => {
              resetForm(); // Reset form after successful login
              navigation.navigate('Drawer');
            },
          },
        ]);
        // Navigate to your home screen here
      } else {
        // Show error message
        setErrorMessage(result.message);
        Alert.alert('Login Error', result.message);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage('');
  };

  // Reset form when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => resetForm();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {errorMessage ? <Text style={{ color: '#ff4d4d' }}>{errorMessage}</Text> : null}
      {/* Email Input */}
      <TextInput
        style={[
          styles.input,
          emailError ? styles.inputError : null, // Apply error style if there's an email error
        ]}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) {setEmailError(null);} // Clear error message on typing
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input */}
      <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError(null); // Clear error message on typing
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        <Text style={styles.registerText1}>Don't have an account? </Text>
        <Text onPress={() => navigation.navigate('Register')}>Register</Text>
      </Text>
    </View>
  );
}
