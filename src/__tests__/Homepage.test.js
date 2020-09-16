import React from 'react';
import { Homepage } from '../components/Homepage';
import App from '../App';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';

test('it shows Loading... while the context get the current user', async () => {
  render(
    <AuthProvider value={{ currentUser: null, setPending: true }}>
      <App>
        <Homepage />
      </App>
    </AuthProvider>
  );
  expect(screen.getByText(/loading.../i));
});

test('Go to signup page from the homepage', async () => {
  const { container } = render(
    <AuthContext.Provider value={{ currentUser: null, setPending: false }}>
      <App>
        <Homepage />
      </App>
    </AuthContext.Provider>
  );

  const button = screen.getAllByRole('button', { name: 'Commencer' });
  fireEvent.click(button[0]);
  expect(screen.getByLabelText(/Pseudo/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  expect(
    screen.getByLabelText(/Confirmez votre mot de passe/i)
  ).toBeInTheDocument();
});
