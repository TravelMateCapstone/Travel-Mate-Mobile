import { TravelPlanCard } from '@/components/Plan/TravelPlanCard';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';



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
  ])

  const renderPlanItem = ({ item }: { item: { id: string; location: string; startDate: string; days: number; image: string } }) => (
    <TravelPlanCard
      location={item.location}
      startDate={item.startDate}
      days={item.days}
      image={item.image}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={travelPlans}
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
});
