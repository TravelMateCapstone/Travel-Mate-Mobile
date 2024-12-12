import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, ScrollView } from 'react-native';

export default function FindFriend() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([
    { id: '1', name: 'Nguyen Van A', avatar: 'https://via.placeholder.com/50' },
    { id: '2', name: 'Tran Thi B', avatar: 'https://via.placeholder.com/50' },
    { id: '3', name: 'Le Van C', avatar: 'https://via.placeholder.com/50' },
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm bạn bè..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView nestedScrollEnabled={true} style={{ width: "100%" }}>
        <View>
          <ScrollView horizontal={true} style={{ width: "100%" }}>
            <FlatList
              data={filteredFriends}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.friendCard}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <Text style={styles.friendName}>{item.name}</Text>
                </View>
              )}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  friendCard: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    color: '#333',
  },
});
