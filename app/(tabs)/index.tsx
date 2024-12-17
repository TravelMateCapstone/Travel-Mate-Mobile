import BackgroundHeader from '@/components/Index/BackgroundHeader';
import Posts from '@/components/Index/Posts';
import RecommendedSection from '@/components/Index/RecommendedSection';
import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

export default function HomeScreen() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
      content: 'Exploring the beautiful beaches of Bali!',
      images: [
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
      ],
    },
    {
      id: 2,
      user: 'Jane Smith',
      avatar: 'https://via.placeholder.com/50',
      content: 'Had an amazing trip to the Eiffel Tower!',
      images: ['https://via.placeholder.com/600x400'],
    },
    {
      id: 3,
      user: 'Chris Lee',
      avatar: 'https://via.placeholder.com/50',
      content: 'The food in Tokyo is out of this world!',
      images: [
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
      ],
    },
    {
      id: 4,
      user: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
      content: 'Exploring the beautiful beaches of Bali!',
      images: [
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
      ],
    },
    {
      id: 5,
      user: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
      content: 'Exploring the beautiful beaches of Bali!',
      images: [
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
        'https://via.placeholder.com/600x400',
      ],
    },
  ]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetch('https://travelmateapp.azurewebsites.net/api/BlockContract/get-top-location-details/8')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const formattedPlaces = data.data.$values.map((place: any) => ({
            id: place.locationId,
            name: place.locationName,
            image: place.image,
            description: place.description,
            mapHtml: place.mapHtml,
          }));
          setPlaces(formattedPlaces);
        }
      })
      .catch(error => console.error('Error fetching places:', error));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <BackgroundHeader />
      <View style={styles.information}>
        <RecommendedSection places={places}/>
        <Posts posts={posts} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  information: {
    marginTop: 40,
  },
});
