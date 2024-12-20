import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TourDetail() {
  const { tourId } = useLocalSearchParams();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/tourParticipants/${tourId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setParticipants(response.data.$values);
      } catch (error) {
        // Handle error silently
      }
    }

    fetchParticipants();
  }, [tourId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tour Participants</Text>
      <Text>Tour ID: {tourId}</Text>
      {participants.length === 0 ? (
        <Text>No participants found</Text>
      ) : (
        <FlatList
          data={participants}
          keyExtractor={(item) => item.participantId.toString()}
          renderItem={({ item }) => (
            <View style={styles.participant}>
              <Text style={styles.participantName}>{item.fullName}</Text>
              <Text>Gender: {item.gender}</Text>
              <Text>Address: {item.address}</Text>
              <Text>Phone: {item.phone}</Text>
              <Text>Registered At: {new Date(item.registeredAt).toLocaleDateString()}</Text>
              <Text>Order Code: {item.orderCode}</Text>
              <Text>Payment Status: {item.paymentStatus ? 'Paid' : 'Unpaid'}</Text>
              <Text>Total Amount: {item.totalAmount}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  participant: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
