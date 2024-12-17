import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
  mapHtml: string;
}

interface RecommendedSectionProps {
  places: Place[];
}



const RecommendedSection: React.FC<RecommendedSectionProps> = ({ places }) => {
  const router = useRouter(); // Hook điều hướng
  const handlePress = async (location: string, place: Place) => {
 
    try {
      const response = await axios.get(
        `https://travelmateapp.azurewebsites.net/api/FilterToursWOO/GetAllTour-WithUserDetails-ByLocation?location=${location}`
      );
  
      // Điều hướng và truyền dữ liệu
      router.push({
        pathname: '/placeDetails',
        params: {
          placeData: JSON.stringify(place), // Chuyển dữ liệu thành JSON
          responseData: JSON.stringify(response.data), // Chuyển dữ liệu response
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {places.map((place) => (
          <TouchableOpacity key={place.id} style={styles.card} onPress={() => handlePress(place.name, place)}>
            <Image
              source={{ uri: place.image } as ImageSourcePropType}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{place.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  card: {
    marginRight: 15,
    marginLeft: 20,
  },
  cardImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  cardDescription: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default RecommendedSection;