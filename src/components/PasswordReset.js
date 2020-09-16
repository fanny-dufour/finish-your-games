import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { Alert, Form, FormControl, Button } from 'react-bootstrap';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        setSuccess('Email envoyé');
      })
      .catch(function (err) {
        setError("L'utilisateur n'a pas été trouvé");
      });
  };

  return (
    <div>
      <h3>Mot de passe oublié</h3>
      {error !== '' ? (
        <Alert variant='danger' onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      ) : null}
      {success !== '' ? (
        <Alert variant='success' onClose={() => setSuccess('')} dismissible>
          {' '}
          {success}
        </Alert>
      ) : null}
      <Form className='email' onSubmit={(e) => onSubmit(e)}>
        <Form.Label>Rentrez votre adresse mail</Form.Label>
        <br />
        <FormControl
          type='text'
          name='email'
          onChange={(e) => onChange(e)}
          className='w-25 bg-dark search-bar mr-2'
        />
        <Button type='submit'>Envoyer</Button>
      </Form>
    </div>
  );
};
