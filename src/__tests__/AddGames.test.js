import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AddGames } from '../components/AddGames';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

jest.mock('axios', () => ({
  post: jest.fn(Promise.resolve),
}));

const mockAxiosData = {
  data: [
    {
      id: 1,
      name: 'First Game',
      coversUrl:
        'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
      coversId: 'nocover_qhhlj6',
      genres: [{ name: 'FPS' }],
    },
    {
      id: 2,
      name: 'Second Game',
      coversUrl:
        'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
      coversId: 'nocover_qhhlj6',
      genres: [{ name: 'RPG' }],
    },
  ],
};

const user = {
  uid: '123456',
  email: 'fake@email.com',
};

const mockData = {
  pseudo: 'Jadzia',
  games_list: {},
};

const API = 'https://api-v3.igdb.com/';

jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        update: jest.fn(() => Promise.resolve()),
        get: jest.fn(() => Promise.resolve({ data: () => mockData })),
      })),
    })),
  },
}));

const component = (
  <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
    <MemoryRouter>
      <AddGames />
    </MemoryRouter>
  </AuthContext.Provider>
);

const searchGame = () => {
  const search = 'Game to search';
  const searchBar = screen.getByRole('textbox');
  fireEvent.change(searchBar, {
    target: { value: search },
  });
  screen.getByTestId('search').click();
};

beforeEach(() => {
  axios.post.mockResolvedValue(mockAxiosData);
});

afterEach(() => {
  jest.clearAllMocks();
});

test('it renders with the Search Bar', () => {
  render(component);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});

test('you can search a game and it calls the IGDB API', async () => {
  render(component);
  searchGame();
  expect(screen.getByRole('textbox').value).toBe('Game to search');
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  expect(screen.getByText('First Game')).toBeInTheDocument();
});

test('The Enter key works for searching', async () => {
  render(component);
  const search = 'Game to search';
  const searchBar = screen.getByRole('textbox');
  fireEvent.change(searchBar, {
    target: { value: search },
  });
  fireEvent.keyDown(searchBar, { key: 'Enter', code: 13, charCode: 13 });
  expect(axios.post).toHaveBeenCalled();
});

test('Clicking on a result makes it replaces the input', async () => {
  render(component);
  searchGame();
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  screen.getByRole('button', { name: 'First Game' }).click();
  expect(screen.getByRole('textbox')).toHaveValue('First Game');
});

test('Adding a game clears the input and show the added game in the page', async () => {
  render(component);
  searchGame();
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  screen.getByRole('button', { name: 'First Game' }).click();
  screen.getByRole('button', { name: 'Ajouter à la liste' }).click();
  await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
  expect(screen.getByTestId('added_game')).toHaveTextContent('First Game');
});

test("API doesn't get called if no input", () => {
  render(component);
  screen.getByTestId('search').click();
  expect(axios.post).not.toHaveBeenCalled();
});

test("Games still get added if IGDB don't find it", async () => {
  axios.post.mockResolvedValue(null);
  render(component);
  searchGame();
  await waitFor(() => expect(axios.post).toHaveBeenCalled());
  screen.getByRole('button', { name: 'Ajouter à la liste' }).click();
  await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue(''));
  expect(screen.getByTestId('added_game')).toHaveTextContent('Game to search');
});
