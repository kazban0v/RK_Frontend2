// app/(tabs)/favorites.tsx
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFavorites } from 'context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Избранное</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>Избранное пусто.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push({ pathname: '../details', params: { article: JSON.stringify(item) } })}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd33d',
  },
  itemDescription: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
});