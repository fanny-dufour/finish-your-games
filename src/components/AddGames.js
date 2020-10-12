import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { v1 as uuidv1 } from 'uuid';
import { useAuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import { SearchBar } from './SearchBar';
import { Container, Row, Col } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const AddGames = () => {
  const INITIAL_STATE_GET_GAMES = {
    names: [],
    coversId: [],
    coversUrl: [],
    genres: [],
  };
  const { currentUser } = useAuthContext();
  const [games_list, setGamesList] = useState({});
  const [addedGames, setAddedGames] = useState([]);
  const [newGame, setNewGame] = useState('');
  const [loading, setLoading] = useState({
    loading: true,
    show: true,
  });
  const [games, setGames] = useState({
    ...INITIAL_STATE_GET_GAMES,
  });
  const userId = currentUser.uid;
  const docRef = db.collection('users').doc(userId);
  let history = useHistory();

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

  const getGames = (newGame) => {
    let names = [];
    let coversUrl = [];
    let coversId = [];
    let genres = [];
    if (newGame === '') {
      return;
    }
    axios
      .post(
        `https://polar-wildwood-84115.herokuapp.com/https://api-v3.igdb.com/games/?search=${newGame}&fields=name,cover.url,cover.image_id,genres.name`,
        {
          headers: {
            Accept: 'application/json',
            'user-key': process.env.REACT_APP_USER_KEY,
          },
          params: {
            fields: 'name, cover.image_id, cover.url, genres.name;',
          },
        }
      )
      .then((res) => {
        console.log(res);
        for (let i = 0; i < res.data.length; i++) {
          names.push(res.data[i].name);
          if (res.data[i].cover !== undefined) {
            coversUrl.push(res.data[i].cover.url);
          } else {
            coversUrl.push('');
          }
          if (res.data[i].cover !== undefined) {
            coversId.push(res.data[i].cover.image_id);
          } else {
            coversId.push('nocover_qhhlj6');
          }
          if (res.data[i].genres !== undefined) {
            for (let j = 0; j < res.data[i].genres.length; j++) {
              genres.push(res.data[i].genres[j].name);
            }
          } else {
            genres.push('');
          }
        }
        setGames({
          names: names,
          coversUrl: coversUrl,
          coversId: coversId,
          genres: genres,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (value) => {
    if (value === '') {
      setGames({ ...INITIAL_STATE_GET_GAMES });
    }
    setNewGame(value);
  };

  const onClickResult = (e) => {
    setNewGame(e.target.id);
    setLoading({
      show: false,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onClickSearch(e);
    }
  };

  const handleDoubleClick = (e) => {
    setNewGame('');
    setGames({ ...INITIAL_STATE_GET_GAMES });
  };

  const onClickSearch = () => {
    getGames(newGame);
  };

  const addGame = (e) => {
    if (newGame === '') {
      return;
    }
    let gameToAdd = {};
    let i = games.names.indexOf(newGame);
    if (i !== -1) {
      gameToAdd = {
        id: uuidv1(),
        name: newGame,
        imgUrl: games.coversUrl[i],
        imgId: `https://images.igdb.com/igdb/image/upload/t_cover_big/${games.coversId[i]}.jpg`,
        genres: games.genres[i],
        timePlayed: 0,
        isInput: false,
        start: new Date(),
      };
      console.log(gameToAdd.start);
    } else {
      gameToAdd = {
        id: uuidv1(),
        name: newGame,
        imgId: '',
        timePlayed: 0,
        isInput: false,
        start: new Date(),
      };
    }
    let newGameKey = newGame.replace(/[.$[]]\/#/g, '');
    setGamesList({ ...games_list, [newGameKey]: gameToAdd });
    setAddedGames([...addedGames, newGame]);
    console.log(addedGames);
    docRef
      .update({
        games_list: {
          ...games_list,
          [newGameKey]: gameToAdd,
        },
      })
      .then(() => {
        setNewGame('');
        setGames({ ...INITIAL_STATE_GET_GAMES });
      })
      .catch((err) => {
        console.error(err);
      });;
  };

  return (
    <div className='add-games'>
      <Container>
        <Row>
          <Col className='col-12 col-lg-6 offset-lg-3'>
            <h2 className='text-center mb-4 mt-5 h2'>
              Ajouter un nouveau jeu :{' '}
            </h2>
            <Row>
              <Col className='col-7 pr-0'>
                <SearchBar
                  newGame={newGame}
                  onClick={(e) => onClickResult(e)}
                  onChange={handleChange}
                  games={games}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onDoubleClick={(e) => handleDoubleClick(e)}
                />
              </Col>
              <Col className='col-2 col-md-1 mr-lg-1'>
                <Button onClick={(e) => onClickSearch()} data-testid='search'>
                  <FontAwesomeIcon icon={faSearch} value='Search' />
                </Button>
              </Col>
              <Col className='col-3 col-md-4 col-lg-3 pl-0'>
                <Button
                  onClick={(e) => addGame(e)}
                  className='ml-1 ml-lg-3 mb-5'
                >
                  Ajouter
                </Button>
              </Col>
            </Row>
            <div className='text-center'>
              <h2 className='text-center h2'>Jeux ajoutés : </h2>
              {addedGames.map((game) => (
                <div key={uuidv1()} data-testid='added_game'>
                  {game}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
