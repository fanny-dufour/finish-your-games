import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ModifyProfile } from '../components/ModifyProfile';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { auth } from '../firebase/config';

const mockUser = {
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

afterEach(() => {
  jest.clearAllMocks();
});

const component = (
  <AuthContext.Provider value={{ currentUser: mockUser, setPending: false }}>
    <MemoryRouter>
      <ModifyProfile />
    </MemoryRouter>
  </AuthContext.Provider>
);

test('it renders', () => {
  render(component);
  expect(screen.getByLabelText('Nouveau pseudo')).toBeInTheDocument();
  expect(screen.getByLabelText('Nouveau mot de passe')).toBeInTheDocument();
  expect(
    screen.getByLabelText('Confirmer le nouveau mot de passe')
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Changer le pseudo' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Changer le mot de passe' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Supprimer son compte' })
  ).toBeInTheDocument();
});

test('Change the nickname', async () => {
  render(component);
  const pseudo = screen.getByLabelText('Nouveau pseudo');
  userEvent.type(pseudo, 'Jadziaa');
  userEvent.click(screen.getByRole('button', { name: 'Changer le pseudo' }));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent('Pseudo modifié.')
  );
});

test('Error if the nickname have anything other than letters and numbers', async () => {
  render(component);
  const pseudo = screen.getByLabelText('Nouveau pseudo');
  userEvent.type(pseudo, 'Jadzia3@');
  userEvent.click(screen.getByRole('button', { name: 'Changer le pseudo' }));
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le pseudo ne doit contenir que des caractères alphanumériques.'
    )
  );
});
