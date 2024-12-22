import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TextInput, View, ListRenderItem, Text, TouchableOpacity, Image, Button } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TravelPlan {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  days: number;
  image: string;
  tourName: string;
  creatorName: string;
  creatorImage: string;
  approvalStatus: number;
}

export default function PlanningScreen() {
  const [travelPlans, setTravelPlans] = React.useState<TravelPlan[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedTab, setSelectedTab] = React.useState<number>(1); 
  const router = useRouter();

  useEffect(() => {
    const fetchTravelPlans = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) {
          console.error('User ID or token not found in AsyncStorage');
          return;
        }

        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/local/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tours = response.data.$values.map((tour: any) => ({
          id: tour.tourId,
          location: tour.location,
          startDate: tour.startDate,
          endDate: tour.endDate,
          days: tour.numberOfDays,
          image: tour.tourImage,
          tourName: tour.tourName,
          creatorName: tour.creator.fullname,
          creatorImage: tour.creator.avatarUrl,
          approvalStatus: tour.approvalStatus,
        }));
        setTravelPlans(tours);
      } catch (error) {
        
      }
    };

    fetchTravelPlans();
  }, []);

  const formatDateToVietnamese = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredPlans = travelPlans.filter((plan) => {
    return plan.location.toLowerCase().includes(searchQuery.toLowerCase()) && plan.approvalStatus === selectedTab;
  });

  const renderPlanItem: ListRenderItem<TravelPlan> = ({ item }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: `/tourDetail`, params: { tourId: item.id } })}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.tourName}</Text>
        <Text>{formatDateToVietnamese(item.startDate)} - {formatDateToVietnamese(item.endDate)}</Text>
        <Text>{item.location}</Text>
        {/* Remove creator info */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm địa điểm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.activeTabButton]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 0 && styles.activeTabButtonText]}>Đang chờ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.activeTabButton]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 1 && styles.activeTabButtonText]}>Đã chấp nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 2 && styles.activeTabButton]}
          onPress={() => setSelectedTab(2)}
        >
          <Text style={[styles.tabButtonText, selectedTab === 2 && styles.activeTabButtonText]}>Bị từ chối</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPlans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Bạn chưa có tour nào cả</Text>}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: 'blue',
  },
  tabButtonText: {
    color: 'gray',
  },
  activeTabButtonText: {
    color: 'white',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  creatorInfo: {
    display: 'none', // Hide creator info
  },
  creatorImage: {
    display: 'none', // Hide creator image
  },
});
