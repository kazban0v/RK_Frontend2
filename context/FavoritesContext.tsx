// context/FavoritesContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage?: string;
  content?: string;
  source: { name: string };
}

interface FavoritesContextType {
  favorites: Article[];
  addFavorite: (article: Article) => Promise<void>;
  removeFavorite: (url: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) setFavorites(JSON.parse(stored));
      } catch (err) {
        console.error('Не удалось загрузить избранное', err);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (article: Article) => {
    try {
      const newFavorites = [...favorites, article];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Не удалось добавить в избранное', err);
    }
  };

  const removeFavorite = async (url: string) => {
    try {
      const newFavorites = favorites.filter((item) => item.url !== url);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Не удалось удалить из избранного', err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};