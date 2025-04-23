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
          'https://newsapi.org/v2/top-headlines?country=us&apiKey=c5ea7f723f7841b4bd528c9f81646440' // Замените на ваш ключ
        );
        setArticles(response.data.articles);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить новости');
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
      <Text style={styles.title}>Главные новости</Text>
      <FlatList
        data={articles}
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
});