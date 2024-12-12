import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function LogoHeader({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('@/assets/images/adaptive-icon.png')}
        style={{ width: 80, height: 80 }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{title}</Text>
    </View>
  );
}

function CheckInButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to check in.');
        setLoading(false);
        return;
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get the address
      const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const fullAddress = `${address.name ? address.name + ', ' : ''}${address.street ? address.street + ', ' : ''}${address.city ? address.city + ', ' : ''}${address.region ? address.region + ', ' : ''}${address.country ? address.country : ''}`;

        // Alert with the address details
        Alert.alert('Check-in Successful', `Your current address: \n${fullAddress}`);

        // Log the address (or store it in your application state if needed)
        console.log(`Address: ${fullAddress}`);
      } else {
        Alert.alert('Address not found', 'Could not determine the address. Showing coordinates instead.');
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve location. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -35 }],
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
      }}
      onPress={handleCheckIn}
      disabled={loading} // Disable button while loading
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>
        {loading ? 'Đang check-in' : 'Check-in'}
      </Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleContainerStyle: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            marginHorizontal: -30,
          },
          headerLeftContainerStyle: {
            paddingHorizontal: 10,
          },
        }}
      >
        <Tabs.Screen
  name="index"
  options={{
    headerTitle: () => <LogoHeader title="Trang chủ" />,
    tabBarLabel: 'Trang chủ', // Tiếng Việt cho tab
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="explore"
  options={{
    headerTitle: () => <LogoHeader title="Hợp đồng" />,
    tabBarLabel: 'Hợp đồng', 
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="planning"
  options={{
    headerTitle: () => <LogoHeader title="Quản lí" />,
    tabBarLabel: 'Quản lí', 
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="profile"
  options={{
    headerTitle: () => <LogoHeader title="Hồ sơ" />,
    tabBarLabel: 'Hồ sơ', // Tiếng Việt cho tab
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
    ),
  }}
/>

      </Tabs>
      <CheckInButton />
    </View>
  );
}
