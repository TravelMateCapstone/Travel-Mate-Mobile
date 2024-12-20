import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ContractItem from '../../components/Explore/Contract';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Contract {
  id: string;
  name: string;
  status: string;
  location: string;
  startDate: string;
  days: number;
}

const Explore = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filter, setFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://travelmateapp.azurewebsites.net/api/BlockContract/contracts-by-local/${userId}`);
      const data = await response.json();
      if (data.success) {
        const contracts = data.data.$values.map((contract: any) => ({
          id: contract.tourId,
          name: contract.details.tourName,
          status: contract.status,
          location: contract.location,
          startDate: contract.details.startDate,
          days: contract.details.numberOfDays,
          details: contract.details,
        }));
        setContracts(contracts);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setContracts([]); // Set contracts to an empty array if fetch fails
    }
  };

  const handleContractPress = (contract: Contract) => {
    router.push({
      pathname: '/ContractDetail',
      params: { contract: JSON.stringify(contract) },
    });
  };

  const renderContractItem = ({ item }: { item: Contract }) => (
    <TouchableOpacity onPress={() => handleContractPress(item)}>
      <ContractItem contract={item} />
    </TouchableOpacity>
  );

  const filteredContracts = contracts.filter((contract) => {
    const matchesFilter = filter === 'Tất cả' || contract.status === filter;
    const matchesSearch = 
      (contract.name && contract.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contract.location && contract.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm theo tên hoặc địa điểm..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {/* Thanh bộ lọc */}
      <View style={styles.filterContainer}>
        {['Tất cả', 'Đang xử lý', 'Hoàn thành', 'Đã hủy'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={
                filter === status
                  ? styles.filterButtonTextActive
                  : styles.filterButtonText
              }
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Danh sách hợp đồng */}
      {filteredContracts.length === 0 ? (
        <Text style={styles.noContractsText}>Không có hợp đồng nào</Text>
      ) : (
        <FlatList
          data={filteredContracts}
          keyExtractor={(item) => item.id}
          renderItem={renderContractItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    color: '#555',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  noContractsText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Explore;
