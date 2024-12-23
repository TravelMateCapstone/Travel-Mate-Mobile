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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    const fetchUserIdAndPosts = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          fetch(`https://travelmateapp.azurewebsites.net/api/PastTripPost?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
              const formattedPosts = data.$values.map((post: any) => ({
                id: post.id,
                user: post.travelerName,
                avatar: post.travelerAvatar,
                content: post.caption,
                images: post.tripImages.$values,
                location: post.location,
                createdAt: post.createdAt,
                comments: post.comment ? post.comment.$values : [],
                local: {
                  id: post.localId,
                  name: post.localName,
                  avatar: post.localAvatar,
                },
              }));
              setPosts(formattedPosts);
            })
            .catch(error => console.error('Error fetching posts:', error));
        }
      } catch (error) {
        console.error('Error retrieving userId from AsyncStorage:', error);
      }
    };

    fetchUserIdAndPosts();
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
