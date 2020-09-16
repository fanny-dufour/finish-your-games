import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Homepage } from './components/Homepage';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { NavBar } from './components/Navbar';
import './App.css';
import { ProfilePage } from './components/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { AddGames } from './components/AddGames';
import { GamesList } from './components/GamesList';
import { useAuthContext } from './context/AuthContext';
import { ModifyProfile } from './components/ModifyProfile';
import { FinishedGames } from './components/FinishedGames';
import { PasswordReset } from './components/PasswordReset';

function App() {
  const { currentUser } = useAuthContext() || {};
  const component = currentUser ? ProfilePage : Homepage;

  return (
    <Router>
      <Fragment>
        <NavBar />
        <Switch>
          <Route exact path='/' component={component} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/password-reset' component={PasswordReset} />
          <PrivateRoute exact path='/profile-page' component={ProfilePage} />
          <PrivateRoute
            exact
            path='/modify-profile'
            component={ModifyProfile}
          />
          <PrivateRoute
            exact
            path='/finished-games'
            component={FinishedGames}
          />
          <PrivateRoute exact path='/games-list' component={GamesList} />
          <PrivateRoute exact path='/add-games' component={AddGames} />
        </Switch>
      </Fragment>
    </Router>
  );
}

export default App;
