import React, { useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Infomation from '../../components/Profile/Infomation';
import FindFriend from '../../components/Profile/FindFriend';
import ShareLocation from '../../components/Profile/ShareLocation'; 

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('Thông tin');

  const renderContent = () => {
    switch (activeTab) {
      case 'Thông tin':
        return <Infomation />;
     
      case 'Chia sẻ vị trí': 
        return <ShareLocation />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/120' }} style={styles.profileImage} />
        <Text style={styles.profileName}>Tên người dùng</Text>
        <Text style={styles.profileDetails}>Mô tả ngắn gọn về người dùng</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Thông tin')}>
          <Text style={[styles.tab, activeTab === 'Thông tin' && styles.activeTab]}>Thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Chia sẻ vị trí')}>
          <Text style={[styles.tab, activeTab === 'Chia sẻ vị trí' && styles.activeTab]}>Chia sẻ vị trí</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', 
  },
  profileDetails: {
    fontSize: 16,
    color: '#000000', 
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF', // Changed to white
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  tab: {
    fontSize: 16,
    color: '#000000', // Changed to black
  },
  activeTab: {
    color: '#00FF00', // Changed to bright green
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  card: {
    width: '45%',
    backgroundColor: '#FFFFFF', // Changed to white
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardTitle: {
    fontSize: 14,
    color: '#000000', // Changed to black
    padding: 10,
    textAlign: 'center',
  },
});
