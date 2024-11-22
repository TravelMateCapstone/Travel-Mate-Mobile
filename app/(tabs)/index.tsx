import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, TextInput, Button, View, Alert } from "react-native";
import { ref, set } from "firebase/database";
import { database } from "../../firebaseConfig";

export default function HomeScreen() {
  const [userId, setUserId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSaveLocation = () => {
    if (!userId || !latitude || !longitude) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      Alert.alert("Lỗi", "Vĩ độ và kinh độ phải là số hợp lệ.");
      return;
    }

    // Lưu dữ liệu vào Firebase
    set(ref(database, `locations/${userId}`), {
      userId,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      timestamp: Date.now(),
    })
      .then(() => {
        Alert.alert("Thành công", "Vị trí người dùng đã được lưu.");
        setUserId("");
        setLatitude("");
        setLongitude("");
      })
      .catch((error) => {
        Alert.alert("Lỗi", `Không thể lưu dữ liệu: ${error.message}`);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Thêm Vị Trí Người Dùng</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>User ID:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập User ID"
          value={userId}
          onChangeText={setUserId}
        />
        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <Button title="Lưu vị trí" onPress={handleSaveLocation} />
      </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
