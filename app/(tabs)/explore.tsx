import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
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
  };

  renderContractItem = ({ item }: { item: Contract }) => {
    return <ContractItem contract={item} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.contracts}
          keyExtractor={(item) => item.id}
          renderItem={this.renderContractItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contractItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  contractName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contractDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
});
