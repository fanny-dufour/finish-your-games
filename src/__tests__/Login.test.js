import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../components/Login';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { auth } from '../firebase/config';

jest.spyOn(auth, 'signInWithEmailAndPassword');

beforeEach(() => {
  const { container } = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
});

test('You can login with correct credentials', async () => {
  const email = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(email, {
    target: { value: 'fake@email.com' },
  });
  const password = screen.getByPlaceholderText('Mot de passe');
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  screen.getByRole('button', { name: 'Se Connecter' }).click();
});

test('Error if no email', async () => {
  const password = screen.getByPlaceholderText('Mot de passe');
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  screen.getByRole('button', { name: 'Se Connecter' }).click();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

test('Error if no password', async () => {
  const email = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(email, {
    target: { value: 'fake@email.com' },
  });
  screen.getByRole('button', { name: 'Se Connecter' }).click();
  expect(screen.getByRole('alert')).toBeInTheDocument();
});
