import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import { ref, set, onValue } from "firebase/database";
import { database } from "../../firebaseConfig";

type UserLocation = {
  userId: string;
  latitude: number;
  longitude: number;
};

export default function TabTwoScreen() {
  const [userId] = useState(`user-${Math.floor(Math.random() * 10000)}`); // Tạo ID duy nhất
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [allLocations, setAllLocations] = useState<UserLocation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const requestPermissionsAndTrackLocation = async () => {
      // Yêu cầu quyền truy cập vị trí
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí đã bị từ chối.");
        return;
      }

      // Bắt đầu theo dõi vị trí của người dùng
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Cập nhật mỗi 5 giây
          distanceInterval: 10, // Cập nhật nếu di chuyển ít nhất 10 mét
        },
        (newLocation) => {
          setLocation(newLocation);
          // Lưu vị trí của người dùng vào Firebase
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

    // Hủy theo dõi khi component unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [userId]);

  useEffect(() => {
    // Theo dõi danh sách vị trí của tất cả người dùng từ Firebase
    const locationsRef = ref(database, "locations");
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locationsArray = Object.values(data) as UserLocation[];
        setAllLocations(locationsArray);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Khám phá</Text>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <View>
          <Text style={styles.text}>
            Vị trí của bạn:
            {location ? `\nLatitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}` : " Đang tải..."}
          </Text>
          <Text style={styles.subHeader}>Vị trí của tất cả người dùng:</Text>
          {allLocations.map((loc, index) => (
            <Text key={index} style={styles.text}>
              {loc.userId}: {`Latitude: ${loc.latitude}, Longitude: ${loc.longitude}`}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
});
