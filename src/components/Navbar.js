import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';

export const NavBar = () => {
  const history = useHistory();
  const { currentUser } = useAuthContext() || {};
  const onClick = (e) => {
    e.preventDefault();
    auth
      .signOut()
      .then(() => {
        history.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Navbar collapseOnSelect expand='lg' className='pb-2 pt-2'>
      <Navbar.Brand href='/'>Accueil</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          {!currentUser ? null : (
            <NavDropdown title='Jeux' id='collasible-nav-dropdown'>
              <NavDropdown.Item href='/add-games'>
                Ajouter des jeux en cours
              </NavDropdown.Item>
              <NavDropdown.Item href='/games-list'>
                Voir les jeux en cours
              </NavDropdown.Item>
              <NavDropdown.Item href='/finished-games'>
                Voir les jeux finis et modifier l'objectif de jeux à finir
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {!currentUser ? (
            <Nav.Link href='/signup'>S'inscrire</Nav.Link>
          ) : (
            <Nav.Link href='/modify-profile'>Modifier le profil</Nav.Link>
          )}
          {!currentUser ? (
            <Nav.Link href='/login'>Se connecter</Nav.Link>
          ) : null}
        </Nav>
        {currentUser ? (
          <Button onClick={(e) => onClick(e)} justify-item='right'>
            Déconnexion
          </Button>
        ) : null}
      </Navbar.Collapse>
    </Navbar>
  );
};
