import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { auth, db } from '../firebase/config.js';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export const Signup = ({ history }) => {
  const INITIAL_STATE = {
    pseudo: '',
    email: '',
    password: '',
    password2: '',
  };

  const [value, setValue] = useState({
    ...INITIAL_STATE,
  });
  const [errors, setErrors] = useState('');

  const { pseudo, email, password, password2 } = value;

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let pseudoVerif = pseudo.match('^[A-Za-z0-9]+$');
    if (pseudoVerif === null || pseudo !== pseudoVerif.toString()) {
      setErrors(
        'Le pseudo ne doit contenir que des caractères alphanumériques.'
      );
      pseudoVerif = '';
      return;
    }
    if (password !== password2) {
      setErrors('Les mots de passe ne correspondent pas.');
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((data, user) => {
        db.collection('users')
          .doc(data.user.uid)
          .set({
            pseudo,
            email,
            game_goal: 0,
            games_list: {},
            games_finished_nb: 0,
            games_finished_names: [],
            steamId: '',
          })
          .then(() => {
            console.log('User Added');
          })
          .catch((err) => {
            console.log(err);
          });
        history.push('/profile-page');
      })
      .catch((error) => {
        var errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          setErrors('Cette adresse mail existe déjà.');
        }
        if (errorCode === 'auth/invalid-email') {
          setErrors("L'adresse mail n'est pas valide");
        }
      });
  };

  return (
    <div className='homepage pt-5'>
      <Container>
        <Row>
          <Col lg={{ span: 5, offset: 3 }}>
            <h2 className='text-center'>S'inscrire</h2>
            {errors !== '' ? (
              <Alert variant='danger' onClose={() => setErrors('')} dismissible>
                {errors}
              </Alert>
            ) : null}
            <Form className='form' onSubmit={(e) => onSubmit(e)}>
              <Form.Group controlId='formPseudo'>
                <Form.Label>Pseudo</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Pseudo'
                  name='pseudo'
                  onChange={(e) => onChange(e)}
                  value={pseudo}
                  required
                />
              </Form.Group>
              <Form.Group controlId='formEmail'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='text'
                  name='email'
                  value={email}
                  placeholder='Email'
                  onChange={(e) => onChange(e)}
                  required
                />
              </Form.Group>
              <Form.Group controlId='formPassword'>
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder='Mot de passe'
                  value={password}
                  onChange={(e) => onChange(e)}
                  required
                />
              </Form.Group>
              <Form.Group controlId='formPasswordConfirmation'>
                <Form.Label>Confirmez votre mot de passe</Form.Label>
                <Form.Control
                  type='password'
                  name='password2'
                  value={password2}
                  onChange={(e) => onChange(e)}
                  placeholder='Confirmez votre mot de passe'
                  required
                />
              </Form.Group>
              <Button type='submit' className='mb-2'>
                S'inscrire
              </Button>
            </Form>
            <p>
              Déjà un compte ? <Link to='/login'>Se connecter.</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
