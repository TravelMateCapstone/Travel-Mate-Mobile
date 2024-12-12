import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, ImageSourcePropType } from 'react-native';

interface RecommendedSectionProps {
  places: string[]; // Array of strings for place names
}

const RecommendedSection: React.FC<RecommendedSectionProps> = ({ places }) => {
  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {places.map((place, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' } as ImageSourcePropType}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{place}</Text>
          </View>
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
});

export default RecommendedSection;