import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Participant {
  participantId: number;
  fullName: string;
  gender: string;
  address: string;
  phone: string;
  registeredAt: string;
  orderCode: string;
  paymentStatus: boolean;
  totalAmount: number;
}

export default function TourDetail() {
  const { tourId } = useLocalSearchParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedTab, setSelectedTab] = useState<'paid' | 'unpaid'>('paid');

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

  const filteredParticipants = participants.filter(participant => 
    selectedTab === 'paid' ? participant.paymentStatus : !participant.paymentStatus
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'paid' && styles.activeTab]}
          onPress={() => setSelectedTab('paid')}
        >
          <Text style={styles.tabText}>Đã thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unpaid' && styles.activeTab]}
          onPress={() => setSelectedTab('unpaid')}
        >
          <Text style={styles.tabText}>Chưa thanh toán</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {filteredParticipants.length === 0 ? (
          <Text style={styles.noParticipantsText}>Không có người tham gia</Text>
        ) : (
          <FlatList
            data={filteredParticipants}
            keyExtractor={(item) => item.participantId.toString()}
            renderItem={({ item }) => (
              <View style={styles.participant}>
                <Text style={styles.participantName}>{item.fullName}</Text>
                <Text style={styles.participantDetail}>Giới tính: {item.gender}</Text>
                <Text style={styles.participantDetail}>Địa chỉ: {item.address}</Text>
                <Text style={styles.participantDetail}>Số điện thoại: {item.phone}</Text>
                <Text style={styles.participantDetail}>Đăng ký lúc: {new Date(item.registeredAt).toLocaleDateString()}</Text>
                <Text style={styles.participantDetail}>Mã đơn hàng: {item.orderCode}</Text>
                <Text style={styles.participantDetail}>Trạng thái thanh toán: {item.paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
                <Text style={styles.participantDetail}>Tổng số tiền: {item.totalAmount}</Text>
              </View>
            )}
          />
        )}
      </View>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  noParticipantsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  participant: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  participantDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});
