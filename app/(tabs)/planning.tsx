import React from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { TravelPlanCard } from '@/components/Plan/TravelPlanCard';

export default function PlanningScreen() {
  const [travelPlans, setTravelPlans] = React.useState([
    {
      id: '1',
      location: 'Đà Lạt',
      startDate: '2024-12-20',
      days: 3,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      location: 'Hà Nội',
      startDate: '2025-01-15',
      days: 5,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      location: 'Phú Quốc',
      startDate: '2025-02-10',
      days: 4,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPlans = travelPlans.filter((plan) => {
    return plan.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderPlanItem = ({ item }) => (
    <TravelPlanCard
      location={item.location}
      startDate={item.startDate}
      days={item.days}
      image={item.image}
    />
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm địa điểm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredPlans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});