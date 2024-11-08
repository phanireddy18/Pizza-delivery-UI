/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {StackNavigationProp} from '@react-navigation/stack';
import styles from '../../styles/loginScreen.scss';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {validateEmail, validatePassword} from '../utils/authUtils';
import {loginUser} from '../services/loginService';
import {RootStackParamList} from '../../type';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [errorMessage, setErrorMessage] = useState('');
  const {height, width} = Dimensions.get('window');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      setErrorMessage('');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      setErrorMessage('');
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      setErrorMessage('');
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters long');
      setErrorMessage('');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (valid) {
      setLoading(true); // Start loading
      try {
        const result = await loginUser(email, password);
        console.log('Login successful:', result);

        setLoading(false); // Stop loading
        if (result.success) {
          resetForm();
          navigation.navigate('Drawer'); // Navigate to your home screen
        } else {
          setPasswordError(result.message); // Show error in password field
          resetForm(); // Optionally reset form on error
          setErrorMessage(result.message);
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoading(false); // Stop loading in case of error
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
    }, []),
  );

  return (
    <ImageBackground
      source={require('../assets/images/pizza.jpg')}
      resizeMethod={'auto'}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden', // prevent image overflow the container
        backgroundColor: '#000',
      }}
      imageStyle={{
        resizeMode: 'cover',
        height: height,
        width: width,
        justifyContent: 'center',
        opacity: 0.4,
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {/* // Display error message */}
        {errorMessage ? (
          <Text style={styles.loginErrorMsg}>{errorMessage}</Text>
        ) : null}
        {/* Email Input */}
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError(null);
            if (emailError) {
              setEmailError(null);
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        {/* Password Input */}
        <View
          style={[
            styles.passwordContainer,
            passwordError ? styles.inputError : null,
          ]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError(null);
              if (passwordError) {
                setPasswordError(null);
              }
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        {/* Activity Indicator */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={{marginVertical: 20}}
          />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.registerText}>
          <Text style={styles.registerText1}>Don't have an account? </Text>
          <Text onPress={() => navigation.navigate('Register')}>Register</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}
