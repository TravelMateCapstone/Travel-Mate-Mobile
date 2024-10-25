import { ScrollView, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        Hồ sơ
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
