import React from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
const backgroundImage = require('../../assets/images/backgroundImage.png');
export default function BackgroundHeader() {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.greeting}>Khám phá Việt Nam</Text>
        <Text style={styles.question}>Cùng người địa phương</Text>
        <View style={styles.searchBar}>
          <TextInput placeholder="Bạn muốn đến..." style={styles.input} />
        </View>
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
});