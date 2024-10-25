import { ScrollView, Text, StyleSheet } from 'react-native';

export default function PlanningScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>
        Lên kế hoạch
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
