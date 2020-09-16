import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export const SearchBar = (props) => {
  const [loading, setLoading] = useState({
    loading: true,
    show: true,
  });

  const handleChange = (e) => {
    props.onChange(e.target.value);
  };

  return (
    <div id='search-bar'>
      <input
        type='text'
        value={props.newGame}
        name='game'
        onChange={handleChange}
        onKeyDown={props.onKeyDown}
        className='w-100 bg-dark search-bar'
      />
      <ListGroup onClick={props.onClick} className='mb-2'>
        {props.games && props.newGame !== '' && loading.show === true
          ? props.games.names.map((res) => (
              <ListGroupItem
                action
                onClick={props.onClick}
                className='results py-0 my-0 bg-dark'
                key={uuidv4()}
                id={res}
              >
                {res}
              </ListGroupItem>
            ))
          : null}
      </ListGroup>
    </div>
  );
};
