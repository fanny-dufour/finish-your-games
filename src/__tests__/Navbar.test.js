import React from 'react';
import { AuthContext } from '../context/AuthContext';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { NavBar } from '../components/Navbar';
import { auth } from '../firebase/config';

const user = {
  uid: '123456',
  email: 'fake@email.com',
};

const mockSignOut = jest.spyOn(auth, 'signOut');

test('navbar with no user connected', () => {
  render(
    <AuthContext.Provider value={{ currentUser: null, setPending: false }}>
      <NavBar />
    </AuthContext.Provider>
  );
  expect(screen.getByRole('link', { name: 'Accueil' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: "S'inscrire" })).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Se connecter' })
  ).toBeInTheDocument();
});

test('navbar with user connected', () => {
  render(
    <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
      <NavBar />
    </AuthContext.Provider>
  );
  expect(screen.getByRole('link', { name: 'Accueil' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Jeux' })).toBeInTheDocument();
  screen.getByRole('button', { name: 'Jeux' }).click();
  expect(
    screen.getByRole('link', { name: 'Ajouter des jeux en cours' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Voir les jeux en cours' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', {
      name: "Voir les jeux finis et modifier l'objectif de jeux à finir",
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Modifier le profil' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Déconnexion' })
  ).toBeInTheDocument();
});

test('deconnexion and redirect to homepage', () => {
  render(
    <AuthContext.Provider value={{ currentUser: user, setPending: false }}>
      <NavBar />
    </AuthContext.Provider>
  );
  screen.getByRole('button', { name: 'Déconnexion' }).click();
  expect(mockSignOut).toHaveBeenCalled();
});
