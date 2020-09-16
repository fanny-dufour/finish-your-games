import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import firebase from 'firebase';
import { fr } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import DatePicker from 'react-datepicker';
registerLocale('fr', fr);

export const GameCard = (props) => {
  const onChangeDate = (date, name) => {
    props.setStartDate(date);
    props.updateGamesList(props.name, 'start', date);
  };

  return (
    <Col xs='11' sm='6' lg='4' className='d-flex align-items-stretch'>
      <Card bg='dark' text='light' className='card text-center mb-5'>
        <Card.Img
          variant='top'
          src={props.imgId}
          size='lg'
          className='img-card'
        />
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>Genre : {props.genres}</Card.Text>
          <div>
            Vous avez joué
            {props.isInput.input && props.isInput.clickedElem === props.name ? (
              <input
                type='text'
                value={props.hoursPlayed}
                onChange={(e) => props.onChangeInput(e)}
                onKeyDown={(e) => props.onKeydownInput(e, props.name)}
                name={props.name}
                className='time-played'
                data-testid={`time-played-input-${props.id}`}
                size='2'
              ></input>
            ) : (
              <p
                onClick={() => props.onClickInput(props.name, props.timePlayed)}
                name={props.name}
                className='time-played'
                data-testid={`time-played-${props.id}`}
              >
                {props.timePlayed !== '' && props.timePlayed > 0
                  ? props.timePlayed
                  : 0}
              </p>
            )}
            heures
          </div>
          <div>Commencé le</div>
          <DatePicker
            selected={props.start}
            onChange={(date) =>
              onChangeDate(firebase.firestore.Timestamp.fromDate(date))
            }
            locale='fr'
            dateFormat='dd/MM/yyyy'
            className='mb-3 mt-1 text-center'
          />
          <Button
            className='mr-2'
            name={props.name}
            variant='danger'
            onClick={() => props.deleteGame(props.id, props.name)}
            data-testid={`delete-${props.id}`}
          >
            Supprimer le jeu
          </Button>
          <Button
            name={props.name}
            variant='success'
            onClick={() => props.gameFinished(props.id, props.name)}
            data-testid={`completed-${props.id}`}
          >
            Jeu terminé
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};
