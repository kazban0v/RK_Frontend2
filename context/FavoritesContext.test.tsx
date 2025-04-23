// context/FavoritesContext.test.tsx
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { FavoritesProvider, useFavorites } from './FavoritesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const article = {
    url: 'https://example.com/1',
    title: 'Тестовая новость',
    description: 'Тестовое описание',
    source: { name: 'Test Source' },
  };

  return (
    <>
      <Text testID="favorites-length">{favorites.length}</Text>
      <Text testID="add" onPress={() => addFavorite(article)}>
        Добавить
      </Text>
      <Text testID="remove" onPress={() => removeFavorite(article.url)}>
        Удалить
      </Text>
    </>
  );
};

describe('FavoritesContext', () => {
  test('добавляет и удаляет избранное', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const addButton = getByTestId('add');
    const removeButton = getByTestId('remove');
    const favoritesLength = getByTestId('favorites-length');

    expect(favoritesLength.props.children).toBe(0);

    await waitFor(() => {
      fireEvent.press(addButton);
    });
    expect(favoritesLength.props.children).toBe(1);

    await waitFor(() => {
      fireEvent.press(removeButton);
    });
    expect(favoritesLength.props.children).toBe(0);
  });
});