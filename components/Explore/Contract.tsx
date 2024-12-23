import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface Contract {
  id: string;
  name: string;
  status: string;
  location: string;
  createdAt: string;
}

interface ContractProps {
  contract: Contract;
}

const ContractItem: React.FC<ContractProps> = ({ contract }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.contractItem} 
      onPress={() => navigation.navigate('ContractDetail', { contract })}
    >
      
      <View style={styles.row}>
        <Icon name="check-circle" size={18} color="#FF9800" style={styles.icon} />
        <Text style={styles.contractDetail}>Trạng thái: {contract.status}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="location-on" size={18} color="#2196F3" style={styles.icon} />
        <Text style={styles.contractDetail}>Địa điểm: {contract.location}</Text>
      </View>
     
    </TouchableOpacity>
  );
};

export default ContractItem;

const styles = StyleSheet.create({
  contractItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
  },
  contractName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contractDetail: {
    fontSize: 14,
    color: '#555',
  },
});
