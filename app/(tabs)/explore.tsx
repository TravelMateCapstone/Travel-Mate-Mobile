import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions, AppState } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { ref, set, onValue, remove } from "firebase/database";
import { database } from "../../firebaseConfig";
import { FontAwesome } from '@expo/vector-icons';

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
};

export default function TabTwoScreen() {
  const mapRef = useRef<MapView>(null);
  const [userId] = useState(`user-${Math.floor(Math.random() * 10000)}`);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [allLocations, setAllLocations] = useState<UserLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialFit, setInitialFit] = useState(true);

  const getUserIcon = (id: string) => {
    if (!id) return null; // Add this check
    const icons = [
      { component: FontAwesome, name: "user-circle" },
    ];
    const colors = ["black", "red", "blue", "green", "purple", "orange", "brown", "pink", "gray", "yellow"];
    const usedColors = new Set<string>();
    const userNumber = parseInt(id.split("-")[1], 10);
    const IconComponent = icons[userNumber % icons.length].component;
    const iconName = icons[userNumber % icons.length].name;
    let color = colors[userNumber % colors.length];

    while (usedColors.has(color)) {
      color = colors[Math.floor(Math.random() * colors.length)];
    }
    usedColors.add(color);

    return <IconComponent name={iconName as any} size={24} color={color} />;
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const requestPermissionsAndTrackLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí đã bị từ chối.");
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
          set(ref(database, `locations/${userId}`), {
            userId,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            timestamp: Date.now(),
          });
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
    const locationsRef = ref(database, "locations");
    const unsubscribe = onValue(locationsRef, (snapshot: { val: () => any; }) => {
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
      const coordinates = allLocations.map((loc: { latitude: any; longitude: any; }) => ({
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
    const appStateListener = AppState.addEventListener("change", (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        // Xóa vị trí của người dùng khỏi Firebase khi ứng dụng chuyển sang nền
        remove(ref(database, `locations/${userId}`));
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, [userId]);

  return (
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
          {/* Marker của bạn */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Bạn"
            description="Vị trí hiện tại của bạn"
            image={require("../../assets/images/favicon.png")} // Biểu tượng của bạn
          />
          {/* Marker của tất cả người dùng khác, không bao gồm chính bạn */}
          {allLocations.map((loc: { userId: string; latitude: any; longitude: any; }, index: any) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
