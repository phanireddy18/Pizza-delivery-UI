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
  const [address, setAddress] = useState(''); // New state for address
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '', // New error for address
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
      address: '', // New validation for address
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
      // Address validation
      newErrors.address = 'Address is required.';
      hasError = true;
    }

    setErrors(newErrors); // Update the error state

    if (!hasError) {
      const data = {
        username,
        phoneNumber,
        email,
        password,
        address, // Include address in the data
      };

      try {
        const response = await registerService(data);
        console.log('Registration successful:', response);

        // Reset all fields
        setUsername('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAddress(''); // Reset address field
        setErrors({
          username: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '', // Reset address error
        });

        navigation.navigate('Home');
      } catch (error: any) {
        console.error(
          'Registration failed:',
          error.response?.data || error.message,
        );
        setErrors({
          ...newErrors,
        });
      }
    }
  };

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
        height: '100vh',
        width: '100%',
        justifyContent: 'center',
        opacity: 0.3,
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        {/* Existing fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#fff"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber ? (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* New Address field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#fff"
            value={address}
            onChangeText={setAddress}
          />
          {errors.address ? (
            <Text style={styles.errorText}>{errors.address}</Text>
          ) : null}
        </View>

        {/* Password fields */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
            <Icon
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View>
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>
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
