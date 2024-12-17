import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';

interface Tour {
  TourId: string;
  TourName: string;
  Location: string;
  StartDate: string;
  EndDate: string;
  TourDescription: string;
  Price: number;
  TourImage: string;
  User: {
    FullName: string;
    Profile: {
      Address: string;
      ImageUser: string;
    };
  };
}

const PlaceDetails = () => {
  const params = useLocalSearchParams();

  // Parse data from params
  const placeData = JSON.parse(params.placeData as string);
  const responseData: Tour[] = JSON.parse(params.responseData as string);

  return (
    <ScrollView style={styles.container}>
      {/* Thông tin địa điểm */}
      <View style={styles.header}>
        <Image source={{ uri: placeData.image }} style={styles.placeImage} />
        <Text style={styles.placeTitle}>{placeData.name}</Text>
        <Text style={styles.placeDescription}>{placeData.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>Các tour có sẵn:</Text>

      {/* Danh sách các tour */}
      {responseData.map((tour) => (
        <View key={tour.TourId} style={styles.tourCard}>
          <Image source={{ uri: tour.TourImage }} style={styles.tourImage} />
          <View style={styles.tourDetails}>
            <Text style={styles.tourName}>{tour.TourName}</Text>
            <Text style={styles.tourLocation}>📍 {tour.Location}</Text>
            <Text style={styles.tourDescription} numberOfLines={3}>
              {tour.TourDescription}
            </Text>
            <Text style={styles.tourPrice}>💰 {tour.Price.toLocaleString()} VND</Text>
          </View>
          <View style={styles.organizer}>
            <Image
              source={{ uri: tour.User.Profile.ImageUser }}
              style={styles.organizerImage}
            />
            <View>
              <Text style={styles.organizerName}>{tour.User.FullName}</Text>
              <Text style={styles.organizerAddress}>{tour.User.Profile.Address}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  placeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  placeDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tourCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  tourImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  tourDetails: {
    marginTop: 10,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tourLocation: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  tourDescription: {
    fontSize: 14,
    color: '#555',
  },
  tourPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginTop: 5,
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  organizerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  organizerAddress: {
    fontSize: 12,
    color: '#777',
  },
});

export default PlaceDetails;
