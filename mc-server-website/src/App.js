import React, { Component } from 'react';
import './App.css';
import LandingPage from './components/pages/LandingPage';
import MapPage from './components/pages/MapPage';
import Finance from './components/pages/Finance';
import Players from './components/pages/Players';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Lottery from './components/pages/Lottery';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import SiteNavBar from './components/SiteNavBar';

class App extends Component {
  render() {
    return (
      <Router>
        <SiteNavBar />
        <div>
          <Route exact path="/" render={() => (
              <Redirect to="/home" />
          )} />
          <Route path="/home" component={LandingPage} />
          <Route path="/map" component={MapPage} />
          <Route path="/finance" component={Finance} />
          <Route path="/players" component={Players} />
          <Route path="/lottery" component={Lottery} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
