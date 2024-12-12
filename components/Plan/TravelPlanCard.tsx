import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Định nghĩa kiểu cho props
interface TravelPlanCardProps {
  location: string;
  startDate: string;
  days: number;
  image: string;
}

// Component TravelPlanCard
export const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ location, startDate, days, image }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.detail}>Ngày bắt đầu: {startDate}</Text>
        <Text style={styles.detail}>Số ngày đi: {days}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
});
