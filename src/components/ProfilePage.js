import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import { Container, Row, Col } from 'react-bootstrap';

export const ProfilePage = () => {
  const history = useHistory();
  const { currentUser } = useAuthContext();
  const [games_list, setGamesList] = useState();
  const [pseudo, setPseudo] = useState('');
  const [game_goal, setGameGoal] = useState(0);
  const [games_finished, setGamesFinished] = useState(0);
  const id = currentUser.uid;

  const getUser = (id) => {
    const docRef = db.collection('users').doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc) {
          setPseudo(doc.data().pseudo);
          setGamesList(doc.data().games_list);
          setGameGoal(doc.data().game_goal);
          setGamesFinished(doc.data().games_finished_nb);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getUser(id);
  }, []);

  return (
    <Container className='text-center profile-page mt-5'>
      <Row>
        <Col className='col-lg-12 text-center'>
          <h2 className='mt-5'>Bonjour {pseudo} ! </h2>
        </Col>
      </Row>
      <Row className='mb-5'>
        <Col className='col-lg-6'>
          <p>
            <span className='number' data-testid='goal'>
              {game_goal}
            </span>
            jeu(x) à finir avant d'en acheter un autre
          </p>
        </Col>
        <Col className='col-lg-6'>
          {games_list !== undefined ? (
            <p>
              <span className='number'>{Object.keys(games_list).length}</span>
              jeu(x) en cours
            </p>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className='col-lg-6'>
          <p>
            <span className='number'>{games_finished}</span> jeu(x) terminés.
          </p>
        </Col>
        <Col className='col-lg-6'>
          {games_finished !== 0 && game_goal !== '0' ? (
            <p>
              <span className='number'>
                {parseInt(games_finished / game_goal)}
              </span>
              jeu(x) achetables.
            </p>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};
