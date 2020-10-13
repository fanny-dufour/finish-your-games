import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Container, Row } from 'react-bootstrap';
import { db } from '../firebase/config';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { GameCard } from './GameCard';

export const GamesList = () => {
  const { currentUser } = useAuthContext();
  let history = useHistory();
  const [games_list, setGamesList] = useState({});
  const [isInput, setIsInput] = useState({ input: false, clickedElem: '' });
  const [hoursPlayed, setHoursPlayed] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const userId = currentUser.uid;
  const docRef = db.collection('users').doc(userId);

  const getGamesList = () => {
    docRef
      .get()
      .then((doc) => {
        if (doc) {
          setGamesList(doc.data().games_list);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (currentUser == null) {
      history.push('/login');
    }
    getGamesList();
  }, []);

  const onClickInput = (e, name, timePlayed) => {
    setIsInput({
      input: true,
      clickedElem: name,
    });
    setHoursPlayed(timePlayed);
  };

  const onChangeInput = (e) => {
    setHoursPlayed(e.target.value);
  };

  const updateGamesList = (name, key, value) => {
    name = name.replace(/[.$\[\]\/#]/g, '');
    let updatedGameList = {
      ...games_list,
      [name]: {
        ...games_list[name],
        [key]: value,
      },
    };
    setIsInput({
      input: false,
      clickedElem: '',
    });
    setGamesList(updatedGameList);
    docRef.update({
      [`games_list.${name}.${key}`]: value,
    });
  };

  const onKeydownInput = (e, name) => {
    if (e.key === 'Enter') {
      hoursPlayed !== '' && hoursPlayed > 0
        ? updateGamesList(name, 'timePlayed', hoursPlayed)
        : updateGamesList(name, 'timePlayed', 0);
    }
  };

  const deleteGame = (id, name) => {
    name = name.replace(/[.$\[\]\/#]/g, '');
    let gameToDelete = Object.keys(games_list).filter(
      (game) => games_list[game].id === id
    );
    gameToDelete = gameToDelete.toString();
    let newObj = { ...games_list };
    delete newObj[gameToDelete];
    setGamesList(newObj);
    docRef.update({
      [`games_list.${name}`]: firebase.firestore.FieldValue.delete(),
    });
  };

  const gameFinished = (id, name) => {
    let nameKey = name.replace(/[.$\[\]\/#]/g, '');
    let date = new Date();
    const finishedGame = {
      name: name,
      start: games_list[nameKey].start,
      finished: firebase.firestore.Timestamp.fromDate(date),
      timePlayed: games_list[nameKey].timePlayed,
    };
    docRef
      .update({
        games_finished_nb: firebase.firestore.FieldValue.increment(1),
        games_finished_names: firebase.firestore.FieldValue.arrayUnion(
          finishedGame
        ),
      })
      .then(() => {
        deleteGame(id, name);
      });
  };

  return (
    <div>
      <h3 className='text-center pt-5 pb-5'>Vos jeux en cours : </h3>
      <Container>
        <Row>
          {Object.keys(games_list).map((game, i) => (
            <GameCard
              key={games_list[game].id}
              id={games_list[game].id}
              name={games_list[game].name}
              imgId={games_list[game].imgId}
              timePlayed={games_list[game].timePlayed}
              genres={games_list[game].genres}
              start={games_list[game].start.toDate()}
              docRef={docRef}
              hoursPlayed={hoursPlayed}
              updateGamesList={updateGamesList}
              startDate={startDate}
              setStartDate={setStartDate}
              isInput={isInput}
              setHoursPlayed={setHoursPlayed}
              onChangeInput={(e) => onChangeInput(e)}
              onKeydownInput={(e) => onKeydownInput(e, games_list[game].name)}
              onClickInput={(e) =>
                onClickInput(
                  e,
                  games_list[game].name,
                  games_list[game].timePlayed
                )
              }
              deleteGame={() =>
                deleteGame(games_list[game].id, games_list[game].name)
              }
              gameFinished={() =>
                gameFinished(games_list[game].id, games_list[game].name)
              }
            />
          ))}
        </Row>
      </Container>
    </div>
  );
};
