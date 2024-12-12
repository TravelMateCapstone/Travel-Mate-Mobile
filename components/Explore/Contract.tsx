import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';

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

interface ContractProps {
  contract: Contract;
}

const ContractItem: React.FC<ContractProps> = ({ contract }) => {
  return (
    <View style={styles.contractItem}>
      <Text style={styles.contractName}>{contract.name}</Text>
      <Text style={styles.contractDetail}>Trạng thái: {contract.status}</Text>
      <Text style={styles.contractDetail}>Địa điểm: {contract.location}</Text>
      <Text style={styles.contractDetail}>Ngày bắt đầu: {contract.startDate}</Text>
      <Text style={styles.contractDetail}>Số ngày đi: {contract.days} ngày</Text>
    </View>
  );
};

export default ContractItem;

const styles = StyleSheet.create({
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