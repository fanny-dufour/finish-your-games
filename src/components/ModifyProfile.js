import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import {
  Form,
  FormControl,
  Button,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export const ModifyProfile = ({ history }) => {
  const INITIAL_STATE = {
    pseudo: '',
    password: '',
    password2: '',
  };
  const { currentUser } = useAuthContext();
  const [value, setValue] = useState({
    ...INITIAL_STATE,
  });
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const { pseudo, password, password2 } = value;

  const onChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const deleteAccount = () => {
    if (window.confirm('Voulez-vous supprimer votre compte ?')) {
      db.collection('users')
        .doc(currentUser.uid)
        .delete()
        .then(() => {
          currentUser.delete().then(() => {
            history.push('/');
          });
        });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target.className === 'pseudo') {
      let pseudoVerif = pseudo.match('^[A-Za-z0-9]+$');
      if (pseudoVerif === null || pseudo !== pseudoVerif.toString()) {
        setErrors([
          'Le pseudo ne doit contenir que des caractères alphanumériques.',
        ]);
        pseudoVerif = '';
        return;
      }
      db.collection('users')
        .doc(currentUser.uid)
        .update({
          pseudo,
        })
        .then(() => {
          setSuccess('Pseudo modifié.');
          return;
        });
    }

    if (e.target.className === 'password') {
      if (password !== password2) {
        setErrors('Les mots de passe ne correspondent pas.');
        return;
      }
      currentUser
        .updatePassword(password)
        .then(() => {
          setSuccess('Mot de passe modifié');
          return;
        })
        .catch((error) => {
          let errorCode = error.code;
          if (errorCode === 'auth/weak-password') {
            setErrors('Le mot de passe doit faire au moins 6 caractères');
          }
          if (errorCode === 'auth/requires-recent-login') {
            setErrors(
              'Merci de vous reconnecter avant de changer votre mot de passe.'
            );
          }
          console.log(error);
          return;
        });
    }
  };

  return (
    <Container className='mt-5'>
      <div>
        {errors ? (
          <Alert variant='danger' onClose={() => setErrors(null)} dismissible>
            {errors}
          </Alert>
        ) : null}
        {success ? (
          <Alert variant='success' onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        ) : null}
        <Row>
          <Col>
            <Form className='pseudo' onSubmit={(e) => onSubmit(e)}>
              <Form.Group controlId='formPseudo'>
                <Form.Label>Nouveau pseudo</Form.Label>
                <br />
                <FormControl
                  type='text'
                  name='pseudo'
                  onChange={(e) => onChange(e)}
                  className='w-xs-100 w-md-25 bg-dark search-bar mr-2'
                />
                <Button type='submit' className='mt-2 mt-sm-0'>
                  Changer le pseudo
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form className='password' onSubmit={(e) => onSubmit(e)}>
              <Form.Group controlId='formPassword'>
                <Form.Label className='mt-5'>Nouveau mot de passe</Form.Label>
                <br />
                <FormControl
                  type='password'
                  name='password'
                  onChange={(e) => onChange(e)}
                  className='w-xs-100 w-md-25 bg-dark search-bar mr-2'
                />
              </Form.Group>
              <Form.Group controlId='formPasswordConfirmation'>
                <Form.Label className='mt-0 mt-sm-2'>
                  Confirmer le nouveau mot de passe
                </Form.Label>
                <br />
                <FormControl
                  type='password'
                  name='password2'
                  onChange={(e) => onChange(e)}
                  className='w-xs-100 w-md-25 bg-dark search-bar mr-2'
                />
                <Button type='submit' className='mt-2 mt-sm-0'>
                  Changer le mot de passe
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Button
          variant='danger'
          size='lg'
          className='supp'
          onClick={(e) => deleteAccount()}
        >
          Supprimer son compte
        </Button>
      </div>
    </Container>
  );
};
