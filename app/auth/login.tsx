import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {jwtDecode} from 'jwt-decode';

export const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    navigation.push('/Auth/Login'); // Điều hướng sang màn hình Login
  } catch (error) {
    console.error('Error clearing app data:', error);
  }
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useRouter();

  const handleLogin = async () => {
    const url = 'https://travelmateapp.azurewebsites.net/api/Auth/login';
  
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
  
    const body = {
      username,
      password,
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
  
        // Loại bỏ tiền tố "Bearer " nếu tồn tại
        const token = data.token.replace(/^Bearer\s+/i, '');
  
        // Giải mã token
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        // Lưu token và thông tin giải mã vào AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userData', JSON.stringify(decodedToken));
        console.log(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        await AsyncStorage.setItem('userId', decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        navigation.push('/(tabs)/'); // Điều hướng sang màn hình Home
      } else {
        const errorData = await response.json();
        Alert.alert('Thất bại', errorData.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
      console.error('Error:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Đăng Nhập" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
