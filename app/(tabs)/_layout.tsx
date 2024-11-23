import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';
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

// Remove CheckInButton component and its usage

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
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            headerTitle: () => <LogoHeader title="Khám phá" />,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="planning"
          options={{
            headerTitle: () => <LogoHeader title="Lên kế hoạch" />,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: () => <LogoHeader title="Hồ sơ" />,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* Remove CheckInButton component usage */}
    </View>
  );
}
