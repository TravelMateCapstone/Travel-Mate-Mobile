import React, { useState } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';

// Define types for the state
interface RegisterState {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullname: string;
}

const Register = () => {
  const [state, setState] = useState<RegisterState>({ username: '', password: '', confirmPassword: '', email: '', fullname: '' });

  const handleRegister = async () => {
    const url = 'https://travelmateapp.azurewebsites.net/api/Auth/register';

    if (!state.username || !state.password || !state.confirmPassword || !state.email || !state.fullname) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (state.password !== state.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    const body = {
      username: state.username,
      password: state.password,
      email: state.email,
      fullname: state.fullname,
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
        Alert.alert('Thành công', 'Đăng ký thành công');
        // Navigate to the Login screen or Home screen
      } else {
        const errorData = await response.json();
        Alert.alert('Thất bại', errorData.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
      console.error('Error:', error);
    }
  };

  const handleChange = (field: keyof RegisterState, value: string) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Đăng ký' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Đăng Ký</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={state.username}
          onChangeText={(text) => handleChange('username', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={state.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={state.fullname}
          onChangeText={(text) => handleChange('fullname', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={state.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry
          value={state.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
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
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Register;