/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from '../../styles/registerScreen.scss';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from '../utils/authUtils';
import {registerService} from '../services/registerService';
import {RootStackParamList} from '../../type';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegistrationScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState(''); // State for backend error messages

  const [errors, setErrors] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleRegister = async () => {
    let hasError = false;
    const newErrors = {
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
    };

    // Validation checks
    if (!username) {
      newErrors.username = 'Username is required.';
      hasError = true;
    }

    if (!validatePhone(phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number. Must be 10 digits.';
      hasError = true;
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format.';
      hasError = true;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long.';
      hasError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      hasError = true;
    }

    if (!address) {
      newErrors.address = 'Address is required.';
      hasError = true;
    }

    setErrors(newErrors);
    setBackendError(''); // Clear backend error on new registration attempt

    if (!hasError) {
      const data = {username, phoneNumber, email, password, address};
      try {
        const response = await registerService(data);
        console.log('Registration successful:', response);

        // Reset all fields and errors
        setUsername('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAddress('');
        setErrors({
          username: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
        });
        navigation.navigate('Home');
      } catch (error: any) {
        setBackendError(error.response?.data?.message || error.message); // Store backend error message
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/pizza.jpg')}
      style={{width: '100%', height: '100%', backgroundColor: '#000'}}
      imageStyle={{
        resizeMode: 'cover',
        height: '100vh',
        width: '100%',
        opacity: 0.3,
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        {/* Backend Error Message */}
        {backendError ? (
          <Text style={styles.errorText}>{backendError}</Text>
        ) : null}

        {/* Username Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={text => {
              setUsername(text);
              setErrors(prevErrors => ({...prevErrors, username: ''})); // Clear error on typing
            }}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
        </View>

        {/* Phone Number Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#fff"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              setErrors(prevErrors => ({...prevErrors, phoneNumber: ''}));
            }}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setErrors(prevErrors => ({...prevErrors, email: ''}));
            }}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Address Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#fff"
            value={address}
            onChangeText={text => {
              setAddress(text);
              setErrors(prevErrors => ({...prevErrors, address: ''}));
            }}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* Password and Confirm Password Fields */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setErrors(prevErrors => ({...prevErrors, password: ''}));
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              setErrors(prevErrors => ({...prevErrors, confirmPassword: ''}));
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          <Text style={styles.registerText1}>Don't have an account? </Text>
          <Text onPress={() => navigation.navigate('Login')}>Login</Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default RegistrationScreen;
