// app/(tabs)/index.tsx
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';

export default function Index() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines?country=us&apiKey=c5ea7f723f7841b4bd528c9f81646440' // Country = us для английского языка
        );
        console.log('Full API response:', response.data); // Отладка: выводим полный ответ
        const fetchedArticles = response.data.articles || [];
        console.log('List of articles:', fetchedArticles); // Отладка: выводим статьи
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error loading news:', errorMessage); // Отладка: выводим ошибку
        setError('Failed to load news: ' + errorMessage);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ActivityIndicator size="large" color="#ffd33d" testID="activity-indicator" />
      </GestureHandlerRootView>
    );
  }

  if (error) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Top News</Text>
      {articles.length === 0 ? (
        <Text style={styles.emptyText}>No news to display.</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push({ pathname: '../details', params: { article: JSON.stringify(item) } })}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description || 'No description available'}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </GestureHandlerRootView>
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
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
});