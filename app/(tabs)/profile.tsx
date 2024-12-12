import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity, Dimensions, AppState } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../../firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Import the useRouter hook

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
};

export default function ProfileScreen() {
  const router = useRouter(); // Initialize the router
  const [activeTab, setActiveTab] = useState('Chuyến đi');
  const mapRef = useRef<MapView>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [allLocations, setAllLocations] = useState<UserLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialFit, setInitialFit] = useState(true);

  const getUserIcon = (id: string) => {
  if (!id) return null;

  const icons = [
    { component: FontAwesome, name: 'user-circle' },
  ];

  const colors = ['black', 'red', 'blue', 'green', 'purple', 'orange', 'brown', 'pink', 'gray', 'yellow'];
  const usedColors = new Set<string>();
  
  // Ensure userNumber is a valid number
  const userNumber = parseInt(id.split('-')[1], 10) || 0; // Fallback to 0 if parsing fails
  const iconIndex = userNumber % icons.length;
  const IconComponent = icons[iconIndex]?.component; // Use optional chaining to prevent accessing undefined
  const iconName = icons[iconIndex]?.name; // Use optional chaining here too
  
  if (!IconComponent || !iconName) {
    return null; // Return null if no valid icon is found
  }

  let color = colors[userNumber % colors.length];

  while (usedColors.has(color)) {
    color = colors[Math.floor(Math.random() * colors.length)];
  }
  usedColors.add(color);

  return <IconComponent name={iconName as any} size={24} color={color} />;
};

  

  useEffect(() => {
    // Check if the user is logged in by checking AsyncStorage
    const checkLoginStatus = async () => {
      const id = await AsyncStorage.getItem('id');
      if (!id) {
        // If not logged in, navigate to the login page
        router.push('/Login'); // Navigate to the login screen using expo-router
      } else {
        setUserId(id); // User is logged in, proceed to load data
      }
    };

    checkLoginStatus();
  }, []); // Run this effect when the component mounts

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const requestPermissionsAndTrackLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí đã bị từ chối.');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation: Location.LocationObject) => {
          setLocation({
            ...newLocation,
            timestamp: Date.now(),
          });
          if (userId) {
            set(ref(database, `locations/${userId}`), {
              userId,
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: Date.now(),
            });
          }
        }
      );
    };

    requestPermissionsAndTrackLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [userId]);

  useEffect(() => {
    const locationsRef = ref(database, 'locations');
    const unsubscribe = onValue(locationsRef, (snapshot: { val: () => any }) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.values(data) as UserLocation[];
        setAllLocations(locationsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (mapRef.current && allLocations.length > 0 && initialFit) {
      const coordinates = allLocations.map((loc: { latitude: any; longitude: any }) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));

      if (location) {
        coordinates.push({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });

      setInitialFit(false);
    }
  }, [allLocations, location, initialFit]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (userId) {
          remove(ref(database, `locations/${userId}`));
        }
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, [userId]);

  const handleLogout = async () => {
    if (userId) {
      await remove(ref(database, `locations/${userId}`));
    }
    await AsyncStorage.removeItem('id');
    router.push('/Login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>John Doe</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Chuyến đi')} style={[styles.tab, activeTab === 'Chuyến đi' && styles.activeTab]}>
          <Text style={styles.tabText}>Chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Tìm bạn')} style={[styles.tab, activeTab === 'Tìm bạn' && styles.activeTab]}>
          <Text style={styles.tabText}>Tìm bạn</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === 'Chuyến đi' ? (
          <Text>Content for Chuyến đi</Text>
        ) : (
          <View style={styles.container}>
            {errorMsg ? (
              <Text style={styles.error}>{errorMsg}</Text>
            ) : location ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                region={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Bạn"
                  description="Vị trí hiện tại của bạn"
                  image={require('../../assets/images/favicon.png')}
                />
                {allLocations.map((loc: { userId: string; latitude: any; longitude: any }, index: any) => (
                  loc.userId !== userId && (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                      }}
                      title={loc.userId}
                    >
                      {getUserIcon(loc.userId)}
                    </Marker>
                  )
                ))}
              </MapView>
            ) : (
              <Text>Đang tải vị trí...</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContent: {
    marginTop: 20,
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
