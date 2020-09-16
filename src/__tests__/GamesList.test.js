import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { GamesList } from '../components/GamesList';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase';

const mockGamesData = {
  games_list: {
    'First Game': {
      id: 1,
      name: 'First Game',
      coversUrl:
        'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
      coversId: 'nocover_qhhlj6',
      genres: 'FPS',
      start: new firebase.firestore.Timestamp.fromDate(new Date()),
      timePlayed: 2,
      isInput: false,
    },
    'Second Game': {
      id: 2,
      name: 'Second Game',
      coversUrl:
        'https://images.igdb.com/igdb/image/upload/t_cover_big/nocover_qhhlj6.jpg',
      coversId: 'nocover_qhhlj6',
      genres: 'RPG',
      start: new firebase.firestore.Timestamp.fromDate(new Date()),
      timePlayed: 0,
      isInput: false,
    },
  },
};

const user = {
  uid: '123456',
  email: 'fake@email.com',
};

jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn((users) => ({
      doc: jest.fn((uid) => ({
        get: jest.fn(() => Promise.resolve({ data: () => mockGamesData })),
        update: jest.fn(() => Promise.resolve()),
      })),
    })),
  },
}));

const component = (
  <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
    <MemoryRouter>
      <GamesList />
    </MemoryRouter>
  </AuthContext.Provider>
);

afterEach(() => {
  jest.clearAllMocks();
});

test('it renders with the current games', async () => {
  render(component);
  await waitFor(() =>
    expect(screen.getByText('First Game')).toBeInTheDocument()
  );
  expect(screen.getByText('Second Game')).toBeInTheDocument();
});

test('You can click on the number of hours played and modify the value', async () => {
  render(component);
  await waitFor(() =>
    expect(screen.getByText('First Game')).toBeInTheDocument()
  );
  const p = screen.getByTestId('time-played-1');
  p.click();
  const input = screen.getByTestId('time-played-input-1');
  expect(input).toBeInTheDocument();
  userEvent.type(input, '12');
  fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });
  expect(screen.getByTestId('time-played-1').textContent).toBe('12');
});

test('You can delete the game', async () => {
  render(component);
  await waitFor(() =>
    expect(screen.getByText('First Game')).toBeInTheDocument()
  );
  userEvent.click(screen.getByTestId('delete-1'));
  await waitFor(() => {
    expect(screen.queryByText('First Game')).not.toBeInTheDocument();
  });
});

test('Marking a game as finished make the game disappear from the page', async () => {
  render(component);
  await waitFor(() =>
    expect(screen.getByText('First Game')).toBeInTheDocument()
  );
  userEvent.click(screen.getByTestId('completed-1'));
  await waitFor(() => {
    expect(screen.queryByText('First Game')).not.toBeInTheDocument();
  });
});

test('You can change the start date', async () => {
  render(component);
  await waitFor(() =>
    expect(screen.getByText('First Game')).toBeInTheDocument()
  );
  const date = screen.getAllByRole('textbox', { value: new Date() });
  date[0].click();
  screen.getByLabelText('Choose Monday, August 17th, 2020').click();
  expect(screen.getAllByRole('textbox')[0].value).toBe('17/08/2020');
});
