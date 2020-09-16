import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import { ModifyGoal } from './ModifyGoal';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import firebase from 'firebase';
import { Table, Container, Row, Col, Button } from 'react-bootstrap';
import { v1 as uuidv1 } from 'uuid';

export const FinishedGames = () => {
  const [finishedGames, setFinishedGames] = useState([]);
  const { currentUser } = useAuthContext();
  const id = currentUser.uid;
  const docRef = db.collection('users').doc(id);

  const getFinishedGames = (id) => {
    docRef
      .get()
      .then((doc) => {
        if (doc) {
          setFinishedGames(doc.data().games_finished_names.reverse());
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getFinishedGames(id);
  }, []);

  const deleteGame = (name) => {
    let gamesToKeep = finishedGames.filter((game) => game.name !== name);
    setFinishedGames(gamesToKeep);
    docRef.update({
      games_finished_names: gamesToKeep,
      games_finished_nb: firebase.firestore.FieldValue.increment(-1),
    });
  };

  return (
    <div className='w-100'>
      <Container>
        <Row>
          <Col className='col-12 col-lg-6 mt-5'>
            <ModifyGoal />
          </Col>
        </Row>
        <Row>
          <Col className='col-12 col-lg-6 mt-5'>
            <h3>Jeux terminés</h3>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>Nom du jeu</th>
                <th>Commencé le</th>
                <th>Fini le</th>
                <th>Temps de jeu</th>
                <th>Supprimer le jeu</th>
              </tr>
            </thead>
            <tbody>
              {finishedGames.map((game) => (
                <tr key={uuidv1()}>
                  <td>{game.name}</td>
                  <td>
                    {game.start.toDate().getDate() +
                      '/' +
                      (game.start.toDate().getMonth() + 1) +
                      '/' +
                      game.start.toDate().getFullYear()}
                  </td>
                  <td>
                    {game.finished.toDate().getDate() +
                      '/' +
                      (game.finished.toDate().getMonth() + 1) +
                      '/' +
                      game.finished.toDate().getFullYear()}
                  </td>
                  <td>{game.timePlayed}</td>
                  <td>
                    <Button
                      onClick={(e) => deleteGame(game.name)}
                      data-testid='delete'
                      className='btn btn-danger ml-3 mt-1'
                    >
                      <FontAwesomeIcon icon={faTimesCircle} value='Delete' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
};
