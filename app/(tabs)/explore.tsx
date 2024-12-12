import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ContractItem from '../../components/Explore/Contract';

interface Contract {
  id: string;
  name: string;
  status: string;
  location: string;
  startDate: string;
  days: number;
}

interface State {
  contracts: Contract[];
  filter: string;
  searchQuery: string;
}

export default class Explore extends Component<{}, State> {
  state: State = {
    contracts: [
      {
        id: '1',
        name: 'Hợp đồng Du lịch Hà Nội',
        status: 'Đang xử lý',
        location: 'Hà Nội',
        startDate: '2024-12-20',
        days: 3,
      },
      {
        id: '2',
        name: 'Hợp đồng Du lịch Đà Nẵng',
        status: 'Hoàn thành',
        location: 'Đà Nẵng',
        startDate: '2024-12-10',
        days: 5,
      },
      {
        id: '3',
        name: 'Hợp đồng Du lịch Phú Quốc',
        status: 'Đã hủy',
        location: 'Phú Quốc',
        startDate: '2024-12-15',
        days: 4,
      },
    ],
    filter: 'Tất cả',
    searchQuery: '',
  };

  setFilter = (filter: string) => {
    this.setState({ filter });
  };

  setSearchQuery = (query: string) => {
    this.setState({ searchQuery: query });
  };

  renderContractItem = ({ item }: { item: Contract }) => {
    return <ContractItem contract={item} />;
  };

  render() {
    const { contracts, filter, searchQuery } = this.state;

    const filteredContracts = contracts.filter((contract) => {
      const matchesFilter =
        filter === 'Tất cả' || contract.status === filter;
      const matchesSearch =
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    return (
      <View style={styles.container}>

        {/* Thanh tìm kiếm */}
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm theo tên hoặc địa điểm..."
          value={searchQuery}
          onChangeText={this.setSearchQuery}
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
              onPress={() => this.setFilter(status)}
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
        <FlatList
          data={filteredContracts}
          keyExtractor={(item) => item.id}
          renderItem={this.renderContractItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </View>
    );
  }
}

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
});
