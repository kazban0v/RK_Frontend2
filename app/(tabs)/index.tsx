import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Button, TextInput } from 'react-native';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async (pageNumber: number, query: string) => {
    try {
      setIsLoadingMore(pageNumber > 1);
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&q=${query}&page=${pageNumber}&apiKey=c5ea7f723f7841b4bd528c9f81646440`
      );
      console.log('Full API response:', response.data);
      const fetchedArticles = response.data.articles || [];
      console.log('List of articles:', fetchedArticles);
      if (pageNumber === 1) {
        setArticles(fetchedArticles);
        await AsyncStorage.setItem('cachedNews', JSON.stringify(fetchedArticles)); // Сохраняем новости локально
      } else {
        setArticles((prevArticles) => [...prevArticles, ...fetchedArticles]);
        await AsyncStorage.setItem('cachedNews', JSON.stringify([...articles, ...fetchedArticles]));
      }
      setLoading(false);
      setIsLoadingMore(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error loading news:', errorMessage);
      setError('Failed to load news: ' + errorMessage);
      // Пробуем загрузить кэшированные новости
      try {
        const cached = await AsyncStorage.getItem('cachedNews');
        if (cached) {
          const cachedArticles = JSON.parse(cached);
          setArticles(cachedArticles);
          setError('Showing cached news due to network error');
        }
      } catch (cacheErr) {
        console.error('Error loading cached news:', cacheErr);
      }
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1, searchQuery);
  }, [searchQuery]);

  const loadMoreNews = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, searchQuery);
  };

  if (loading) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ActivityIndicator size="large" color="#ffd33d" testID="activity-indicator" />
      </GestureHandlerRootView>
    );
  }

  if (error && articles.length === 0) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Top News</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search news..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setPage(1);
        }}
      />
      {articles.length === 0 ? (
        <Text style={styles.emptyText}>No news to display.</Text>
      ) : (
        <>
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
          {isLoadingMore ? (
            <ActivityIndicator size="small" color="#ffd33d" style={styles.loadingMore} />
          ) : (
            <Button title="Load More" onPress={loadMoreNews} />
          )}
        </>
      )}
      {error && articles.length > 0 && (
        <Text style={styles.cacheNotice}>{error}</Text>
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
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  item: {
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Для Android
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700', // Более мягкий жёлтый
  },
  itemDescription: {
    fontSize: 14,
    color: '#b0b0b0', // Более мягкий серый
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
  },
  cacheNotice: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingMore: {
    marginVertical: 16,
  },
});