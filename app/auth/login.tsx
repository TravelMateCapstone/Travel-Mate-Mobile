import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { Stack } from 'expo-router';

// Define types for the state
interface LoginState {
  username: string;
  password: string;
}

interface DecodedToken {
  [key: string]: string;
}

export const handleLogout = async (navigation: any) => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    navigation.push('/Auth/Login'); // Navigate to the Login screen
  } catch (error) {
    console.error('Error clearing app data:', error);
  }
};

const Login = () => {
  const [state, setState] = useState<LoginState>({ username: '', password: '' });
  const navigation = useRouter();

  const handleLogin = async () => {
    const url = 'https://travelmateapp.azurewebsites.net/api/Auth/login';

    if (!state.username || !state.password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    const body = {
      username: state.username,
      password: state.password,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        // Remove "Bearer " prefix if exists
        const token = data.token.replace(/^Bearer\s+/i, '');

        // Decode the token
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log(decodedToken);

        // Save the token and decoded user data to AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userData', JSON.stringify(decodedToken));
        await AsyncStorage.setItem('userId', decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        
        navigation.push('/(tabs)/'); // Navigate to the Home screen
      } else {
        const errorData = await response.json();
        Alert.alert('Thất bại', errorData.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
      console.error('Error:', error);
    }
  };

  const handleChange = (field: keyof LoginState, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Đăng nhập' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Đăng Nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={state.username}
          onChangeText={(text) => handleChange('username', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={state.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f7', // Light background color for better contrast
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333', // Dark text for readability
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff', // White input background
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50', // Green color for the button
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
