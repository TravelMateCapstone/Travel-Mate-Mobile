import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, ScrollView, SafeAreaView } from 'react-native';
const backgroundImage = require('../../assets/images/backgroundImage.png');

interface Location {
  locationId: number;
  locationName: string;
}

export default function BackgroundHeader() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch('https://travelmateapp.azurewebsites.net/api/Locations')
      .then(response => response.json())
      .then(data => setLocations(data.$values))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    setFilteredLocations(
      locations.filter(location =>
        location.locationName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, locations]);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.greeting}>Khám phá Việt Nam</Text>
        <Text style={styles.question}>Đồng hành cùng người địa phương</Text>
        {/* <View style={styles.searchBar}>
          <TextInput
            placeholder="Bạn muốn đến..."
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View> */}
        <SafeAreaView style={styles.flatStyle}>
          {searchQuery.length > 0 && (
            <ScrollView contentContainerStyle={styles.scrollView}>
              {filteredLocations.map(item => (
                <View key={item.locationId} style={styles.locationItem}>
                  <Text style={styles.locationName}>{item.locationName}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
  },
  flatStyle: {
    zIndex: 1,
    backgroundColor: 'white',
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  question: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  searchBar: {
    marginTop: 130,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 5,
  },
  input: {
    fontSize: 16,
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationName: {
    fontSize: 16,
  },
  scrollView: {
    flexGrow: 1,
  },
});
