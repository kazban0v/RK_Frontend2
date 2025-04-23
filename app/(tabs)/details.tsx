// app/(tabs)/details.tsx
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFavorites, Article } from 'context/FavoritesContext'; // Используем новый путь через paths

export default function DetailScreen() {
  const { article } = useLocalSearchParams();
  const parsedArticle: Article = JSON.parse(article as string);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some((item: Article) => item.url === parsedArticle.url);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(parsedArticle.url);
    } else {
      addFavorite(parsedArticle);
    }
  };

  return (
    <View style={styles.container}>
      {parsedArticle.urlToImage && (
        <Image source={{ uri: parsedArticle.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{parsedArticle.title}</Text>
      <Text style={styles.content}>{parsedArticle.content || parsedArticle.description}</Text>
      <Text style={styles.source}>Источник: {parsedArticle.source.name}</Text>
      <Button
        title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        onPress={toggleFavorite}
        color={isFavorite ? '#ff4444' : '#ffd33d'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#25292e',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffd33d',
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
    color: '#ccc',
  },
  source: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
});