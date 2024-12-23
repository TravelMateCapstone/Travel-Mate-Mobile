import React, { useState, useEffect } from 'react';
import { View, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { List, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Bật LayoutAnimation cho Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Infomation() {
  const navigation = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const token = AsyncStorage.getItem('token');

  console.log(token);
  

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const fetchData = async () => {
    if (!userId) return;

    try {
      // const profile = await axios.get(`https://travelmateapp.azurewebsites.net/api/Profile/${userId}`);
      // const home = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserHome/user/${userId}`);
      // const tour = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/local/${userId}`, {
      //   headers: {
      //     Authorization: `${token}`,
      //   },
      // });

      // console.log('Profile:', profile.data);
      // console.log('Home:', home.data);
      

      // Handle the fetched data as needed
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handlePress = (section: string) => {
    // Áp dụng hiệu ứng khi mở/đóng Accordion
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === section ? null : section);
  };

  const handleLogout = async () => {
    try {
      // Xóa toàn bộ AsyncStorage
      await AsyncStorage.clear();
      // Điều hướng về trang đăng nhập
      navigation.push('/authenticate'); // Replace để tránh người dùng quay lại bằng nút back
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      

      

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
        Đăng xuất
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  accordion: {
    backgroundColor: '#C8E6C9',
    marginVertical: 5,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#F44336',
  },
});
