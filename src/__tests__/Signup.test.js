import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Signup } from '../components/Signup';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { auth } from '../firebase/config';

const spyCreateUser = jest.spyOn(auth, 'createUserWithEmailAndPassword');

beforeEach(() => {
  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('We can add values for signup', async () => {
  const pseudo = screen.getByRole('textbox', { name: /pseudo/i });
  fireEvent.change(pseudo, {
    target: { value: 'yveri' },
  });
  expect(pseudo.value).toBe('yveri');
});

test('User not created when password confirmation is missing', () => {
  const pseudo = screen.getByRole('textbox', { name: /pseudo/i });
  fireEvent.change(pseudo, {
    target: { value: 'yveri' },
  });
  const email = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(email, {
    target: { value: 'fd@gmail.com' },
  });
  const password = screen.getByPlaceholderText('Mot de passe');
  fireEvent.change(password, {
    target: { value: '123456' },
  });

  screen.getByRole('button', { name: "S'inscrire" }).click();
  expect(spyCreateUser).not.toHaveBeenCalled();
});

test('User not created when email already in use', () => {
  const pseudo = screen.getByRole('textbox', { name: /pseudo/i });
  fireEvent.change(pseudo, {
    target: { value: 'yveri' },
  });
  const email = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(email, {
    target: { value: 'fake@email.com' },
  });
  const password = screen.getByPlaceholderText('Mot de passe');
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  const password2 = screen.getByPlaceholderText(
    /Confirmez votre mot de passe/i
  );
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  screen.getByRole('button', { name: "S'inscrire" }).click();

  expect(screen.getByRole('alert')).toBeInTheDocument();
});

test('User not created if something is missing', () => {
  const email = screen.getByRole('textbox', { name: /email/i });
  fireEvent.change(email, {
    target: { value: 'test@email.com' },
  });
  const password = screen.getByPlaceholderText('Mot de passe');
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  const password2 = screen.getByPlaceholderText(
    /Confirmez votre mot de passe/i
  );
  fireEvent.change(password, {
    target: { value: '123456' },
  });
  screen.getByRole('button', { name: "S'inscrire" }).click();

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(spyCreateUser).not.toHaveBeenCalled();
});
