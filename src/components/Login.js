import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';

export const Login = () => {
  const history = useHistory();
  const INITIAL_STATE = {
    email: '',
    password: '',
  };
  const [value, setValue] = useState({
    ...INITIAL_STATE,
  });
  const [errors, setErrors] = useState('');

  const { email, password } = value;

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '') {
      setErrors("L'email est manquant.");
      return;
    }
    if (password === '') {
      setErrors('Le mot de passe est manquant.');
      return;
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/profile-page');
      })
      .catch((error) => {
        var errorCode = error.code;
        if (
          errorCode === 'auth/user-not-found' ||
          errorCode === 'auth/wrong-password'
        ) {
          setErrors("L'email ou le mot de passe est incorrect");
        }
        if (errorCode === 'auth/invalid-email') {
          setErrors("L'adresse mail n'est pas valide");
        }
        console.log(e);
      });
  };

  return (
    <div className='homepage pt-5'>
      <Container>
        <Row>
          <Col lg={{ span: 5, offset: 3 }}>
            {errors !== '' ? (
              <Alert variant='danger' onClose={() => setErrors('')} dismissible>
                {errors}
              </Alert>
            ) : null}
            <h2 className='text-center'>Se connecter</h2>
            <Form className='form' onSubmit={(e) => onSubmit(e)}>
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
              <Button type='submit' className='mb-2'>
                Se Connecter
              </Button>
            </Form>
            <p>
              Pas de compte ? <Link to='/signup'>S'inscrire.</Link>
            </p>
            <Link to='/password-reset'>Mot de passe oublié ?</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
