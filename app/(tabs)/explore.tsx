import { Image, StyleSheet, ScrollView, Text } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        Khám phá
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
  },

});
