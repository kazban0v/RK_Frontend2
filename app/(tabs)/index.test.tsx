// app/(tabs)/index.test.tsx
import { render, screen, waitFor } from '@testing-library/react-native';
import Index from './index';
import axios from 'axios';

jest.mock('axios');
jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockArticles = [
  {
    url: 'https://example.com/1',
    title: 'Тестовая новость',
    description: 'Тестовое описание',
  },
];

test('отображает состояние загрузки', () => {
  render(<Index />);
  expect(screen.getByTestId('activity-indicator')).toBeTruthy();
});

test('отображает новости после загрузки', async () => {
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { articles: mockArticles } });
  render(<Index />);
  await waitFor(() => {
    expect(screen.getByText('Тестовая новость')).toBeTruthy();
    expect(screen.getByText('Тестовое описание')).toBeTruthy();
  });
});