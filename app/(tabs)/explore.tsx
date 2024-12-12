import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, Dimensions, AppState } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { ref, set, onValue, remove } from "firebase/database";
import { database } from "../../firebaseConfig";
import { MaterialIcons } from '@expo/vector-icons';

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
};

export default function TabTwoScreen() {
  const mapRef = useRef<MapView>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [allLocations, setAllLocations] = useState<UserLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initialFit, setInitialFit] = useState(true);
  const router = useRouter();

  const getUserIcon = (id: string) => {
    const userNumber = parseInt(id.split("-")[1], 10);
    const colors = ["black", "red", "blue", "green", "purple", "orange", "brown", "pink", "gray", "yellow"];
    const color = colors[userNumber % colors.length];
    return <MaterialIcons name="person-pin" size={24} color={color} />;
  };


  useEffect(() => {
    if (!userId) return;

    let locationSubscription: Location.LocationSubscription | null = null;

    const requestPermissionsAndTrackLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Quyền truy cập vị trí đã bị từ chối.");
          console.warn("Không thể cấp quyền vị trí.");
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High, // Chọn độ chính xác cao
            distanceInterval: 10, // Chỉ cập nhật nếu di chuyển ít nhất 10 mét
            timeInterval: 10000, // Cập nhật mỗi 10 giây
          },
          (newLocation: Location.LocationObject) => {
            try {
              setLocation((prevLocation) => {
                if (
                  prevLocation &&
                  prevLocation.coords.latitude === newLocation.coords.latitude &&
                  prevLocation.coords.longitude === newLocation.coords.longitude
                ) {
                  return prevLocation;
                }
                return {
                  ...newLocation,
                  timestamp: Date.now(),
                };
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
            } catch (error) {
              console.error("Lỗi trong quá trình cập nhật vị trí:", error);
            }
          }
        );
      } catch (error) {
        console.error("Lỗi trong quá trình yêu cầu quyền vị trí:", error);
      }
    };

    requestPermissionsAndTrackLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const locationsRef = ref(database, "locations");
    const unsubscribe = onValue(locationsRef, (snapshot: { val: () => any; }) => {
      try {
        const data = snapshot.val();
        if (data) {
          const locationsArray = Object.values(data) as UserLocation[];
          setAllLocations(locationsArray);
        }
      } catch (error) {
        console.error("Lỗi trong quá trình lấy dữ liệu từ Firebase:", error);
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
  }, [allLocations, location, initialFit]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      try {
        if (nextAppState === "background" || nextAppState === "inactive") {
          remove(ref(database, `locations/${userId}`))
            .then(() => {
              console.log("Dữ liệu Firebase đã được xóa khi ứng dụng chuyển sang nền.");
            })
            .catch((error) => {
              console.error("Lỗi trong quá trình xóa dữ liệu Firebase:", error);
            });
        }
      } catch (error) {
        console.error("Lỗi trong quá trình xử lý thay đổi trạng thái ứng dụng:", error);
      }
    };

    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      appStateListener.remove();
    };
  }, [userId]);

  const markers = useMemo(() => {
    return allLocations.map((loc: { userId: string; latitude: any; longitude: any; }, index: any) => (
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
    ));
  }, [allLocations, userId, getUserIcon]);

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
