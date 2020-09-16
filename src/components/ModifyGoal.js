import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Alert, Button } from 'react-bootstrap';
import { db } from '../firebase/config';

export const ModifyGoal = () => {
  const [goal, setGoal] = useState(null);
  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState(null);
  const { currentUser } = useAuthContext();

  const onChange = (e) => {
    setGoal(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let goalVerif = goal.match('^[0-9]+$');
    if (goalVerif === null || goal !== goalVerif.toString()) {
      setErrors('Rentrez un nombre.');
      goalVerif = null;
      return;
    }
    db.collection('users')
      .doc(currentUser.uid)
      .update({
        game_goal: goal,
      })
      .then(() => {
        setSuccess('Nombre de jeux à finir modifié.');
      });
  };
  return (
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
      <form className='goal' onSubmit={(e) => onSubmit(e)}>
        <h3>Modifier votre objectif de jeux à finir.</h3>
        <input
          className='w-xs-100 w-md-25 bg-dark search-bar text-white'
          type='text'
          name='pseudo'
          onChange={(e) => onChange(e)}
        />
        <Button className='mt-2 mt-md-0 ml-2' type='submit'>
          Changer le nombre de jeux à finir.
        </Button>
      </form>
    </div>
  );
};
