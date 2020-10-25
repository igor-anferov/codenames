import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import MainPage from './MainPage'
import Room from './Room'

function App() {
  return (
    <Router basename={ process.env.PUBLIC_URL }>
      <Switch>
        <Redirect exact strict from="/rooms/:roomId/" to="/rooms/:roomId"/>
        <Route path="/rooms/:roomId"
          render={ ({ match }) =>
            <Room roomId={ match.params.roomId }/>
          }
        />
        <Route exact path="/">
          <MainPage/>
        </Route>
        <Redirect to="/"/>
      </Switch>
    </Router>
  );
}

export default App;
