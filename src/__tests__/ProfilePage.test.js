import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from '../components/ProfilePage';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { db } from '../firebase/config';

const user = {
  uid: '123456',
  email: 'fake@email.com',
};

const mockData = {
  pseudo: 'Jadzia',
  games_list: {},
  game_goal: 2,
  games_finished_nb: 3,
};

jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: () => mockData })),
      })),
    })),
  },
}));

test('it renders with the user infos', async () => {
  render(
    <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  await waitFor(() =>
    expect(screen.getByText('Bonjour Jadzia !')).toBeInTheDocument()
  );
});
