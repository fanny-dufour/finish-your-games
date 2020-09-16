import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';

export const Homepage = () => {
  return (
    <Container fluid className='homepage w-100 h-80'>
      <h1 className='text-center pt-5 h1'>Finish your games !</h1>
      <Row className='mr-0'>
        <Col className='col-11 col-xl-6 offset-xl-3'>
          <div className='pt-5 xs-p'>
            <div>
              <p>
                Marre de voir tous ces jeux s'accumuler dans vos différentes
                bibliothèques ? Impossible de vous empêcher d'acheter cet enième
                bundle ? Nous sommes là pour ça.
              </p>
              <p>
                Grâce à la base de données de l'IGDB, vous pouvez chercher des
                jeux sur toutes les plateformes afin d'enfin réduire votre
                backlog de jeux.
              </p>
              <p>Nous vous permettons de : </p>
              <ul>
                <li>
                  Définir un nombre de jeux à finir avant de pouvoir en acheter
                  un autre
                </li>
                <li>
                  Lister vos jeux en cours en précisant le temps de jeu et la
                  date à laquelle vous avez commencé le jeu.
                </li>
                <li>Retrouver une liste de vos jeux terminés.</li>
              </ul>
              <p className='text-center lead mt-5'>
                Prêt(e) à enfin finir vos jeux ?
              </p>
              <div className='text-center'>
                <Link to='/signup'>
                  <Button name='signup' variant='primary' className='commencer'>
                    Commencer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
