import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Dimensions, AppState } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { ref, set, onValue, remove } from "firebase/database";
import { database } from "../../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
};

export default function ShareLocation() {
  const mapRef = useRef<MapView>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [allLocations, setAllLocations] = useState<UserLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialFit, setInitialFit] = useState(true);

  const getUserIcon = (id: string) => {
    const userNumber = parseInt(id.split("-")[1], 10);
    const colors = ["black", "red", "blue", "green", "purple", "orange", "brown", "pink", "gray", "yellow"];
    const color = colors[userNumber % colors.length];
    return <MaterialIcons name="person-pin" size={24} color={color} />;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = `user-${Math.floor(Math.random() * 10000)}`;
        await AsyncStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    let locationSubscription: Location.LocationSubscription | null = null;

    const requestPermissionsAndTrackLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí đã bị từ chối.");
        console.warn("Không thể cấp quyền vị trí.");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 10000,
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
          })
            .then(() => {
              console.log("Ghi dữ liệu Firebase thành công.");
            })
            .catch((error) => {
              console.error("Lỗi ghi dữ liệu Firebase:", error);
            });
        }
      );
    };

    requestPermissionsAndTrackLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      remove(ref(database, `locations/${userId}`));
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const locationsRef = ref(database, "locations");
    const unsubscribe = onValue(locationsRef, (snapshot: { val: () => any; }) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.values(data) as UserLocation[];
        setAllLocations(locationsArray);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (mapRef.current && initialFit && location) {
      const coordinates = allLocations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));

      coordinates.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        setInitialFit(false);
      }
    }
  }, [allLocations, location, initialFit, userId]);

  useEffect(() => {
    if (!userId) return;

    const appStateListener = AppState.addEventListener("change", (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
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
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Bạn"
            description="Vị trí hiện tại của bạn"
            image={require("../../assets/images/favicon.png")}
          />
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
    margin: 20   
  },
  map: {
    width: Dimensions.get("window").width-40,
    height: 400,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});