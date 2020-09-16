import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase';
import { FinishedGames } from '../components/FinishedGames';

const mockGamesData = {
  games_finished_names: [
    {
      finished: new firebase.firestore.Timestamp.fromDate(new Date()),
      name: 'First Game',
      start: new firebase.firestore.Timestamp.fromDate(new Date()),
      timePlayed: 2,
    },
    {
      finished: new firebase.firestore.Timestamp.fromDate(new Date()),
      name: 'Second Game',
      start: new firebase.firestore.Timestamp.fromDate(new Date()),
      timePlayed: 2,
    },
  ],
  game_goal: 2,
  games_finished_nb: 2,
};

const user = {
  uid: '123456',
  email: 'fake@email.com',
};

jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: () => mockGamesData })),
        update: jest.fn(() => Promise.resolve()),
      })),
    })),
  },
}));

const component = (
  <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
    <MemoryRouter>
      <FinishedGames />
    </MemoryRouter>
  </AuthContext.Provider>
);

afterEach(() => {
  jest.clearAllMocks();
});

test('It renders', async () => {
  render(component);
  await waitFor(() => {
    expect(screen.getByText('First Game')).toBeInTheDocument();
  });
  expect(screen.getByRole('textbox')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Changer le nombre de jeux à finir.' })
  ).toBeInTheDocument();
});

test('You can change the goal', async () => {
  render(component);
  await waitFor(() => {
    expect(screen.getByText('First Game')).toBeInTheDocument();
  });
  userEvent.type(screen.getByRole('textbox'), '3');
  screen
    .getByRole('button', { name: 'Changer le nombre de jeux à finir.' })
    .click();
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Nombre de jeux à finir modifié.'
    );
  });
});

test('Only numbers are accepted', async () => {
  render(component);
  await waitFor(() => {
    expect(screen.getByText('First Game')).toBeInTheDocument();
  });
  userEvent.type(screen.getByRole('textbox'), 'sdsd');
  screen
    .getByRole('button', { name: 'Changer le nombre de jeux à finir.' })
    .click();
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Rentrez un nombre.');
  });
});

test('Delete game from the table', async () => {
  render(component);
  await waitFor(() => {
    expect(screen.getByText('First Game')).toBeInTheDocument();
  });
  const gameToDelete = screen.getAllByTestId('delete');
  gameToDelete[0].click();
  await waitFor(() => {
    expect(screen.queryByText('First Game')).not.toBeInTheDocument();
  });
});
