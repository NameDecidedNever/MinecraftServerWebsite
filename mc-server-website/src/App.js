import React, { Component } from 'react';
import './App.css';
import LandingPage from './components/pages/LandingPage';
import MapPage from './components/pages/MapPage';
import Finance from './components/pages/Finance';
import Players from './components/pages/Players';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Towns from './components/pages/Towns';
import ManageTown from './components/pages/ManageTown';
import TownPlots from './components/pages/TownPlots';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import SiteNavBar from './components/SiteNavBar';
import ReleaseBlog from './components/pages/blogs/ReleaseBlog';
import SimpleComponent from './components/pages/SimpleComponent'

class App extends Component {
  render() {
    return (
      <Router>
        <SiteNavBar />
        <div>
          <Route exact path="/" render={() => (
              <Redirect to="/home" />
          )} />
          <Route path="/test" component={SimpleComponent} />
          <Route path="/home" component={LandingPage} />
          <Route path="/map" component={MapPage} />
          <Route path="/finance" component={Finance} />
          <Route path="/players" component={Players} />
          <Route path="/towns" component={Towns} />
          <Route path="/managetown/:name" component={ManageTown} />
          <Route path="/townplots/:name" component={TownPlots} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/blog/release" component={ReleaseBlog} />
        </div>
      </Router>
    );
  }
}

export default App;
