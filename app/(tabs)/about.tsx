// app/(tabs)/about.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>О приложении</Text>
      <Text style={styles.description}>
        Это приложение позволяет просматривать новости, добавлять их в избранное и управлять списком избранного. 
        Разработано в рамках задания AlmaU.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
  },
});