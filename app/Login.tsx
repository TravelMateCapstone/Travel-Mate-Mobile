import { View, Text, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {jwtDecode} from 'jwt-decode';
import { useRouter } from 'expo-router';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://travelmateapp.azurewebsites.net/api/Auth/login', {
        username,
        password,
      })
      const data = response.data
      const token = data.token.replace('Bearer ', ''); // Remove "Bearer " prefix
      const decodedToken = jwtDecode(token)
      
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      
      
      try {
        await AsyncStorage.setItem('id', userId)
        await AsyncStorage.setItem('avatar', decodedToken.ImageUser	)
        await AsyncStorage.setItem('name', decodedToken.FullName)
        await AsyncStorage.setItem('token', token) // Store the token
        console.log(userId);
        
      } catch (storageError) {
        console.error('AsyncStorage error: ', storageError)
        Alert.alert('Storage Error', 'An error occurred while saving data. Please try again.')
        return
      }
      
      // Handle successful login
      console.log('Success login')
      router.replace('/(tabs)/profile')
      console.log('Success login')
    } catch (error) {
      console.error('Login error: ', error)
      Alert.alert('Login Error', 'An error occurred during login. Please try again.')
    }
  }

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}

export default Login