import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('Chuyến đi');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://cdn.oneesports.vn/cdn-data/sites/4/2024/01/Zed_38.jpg' }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>A short bio about John Doe...</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Chuyến đi')} style={[styles.tab, activeTab === 'Chuyến đi' && styles.activeTab]}>
          <Text style={styles.tabText}>Chuyến đi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Tìm bạn')} style={[styles.tab, activeTab === 'Tìm bạn' && styles.activeTab]}>
          <Text style={styles.tabText}>Tìm bạn</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === 'Chuyến đi' ? (
          <Text>Content for Chuyến đi</Text>
        ) : (
          <Text>Content for Tìm bạn</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tab: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContent: {
    marginTop: 20,
    alignItems: 'center',
  },
});
