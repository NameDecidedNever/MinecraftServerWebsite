import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import Iframe from 'react-iframe';
import '../../App.css';

class MapPage extends Component {
  render() {
    return (
      <Container>
        &nbsp;
        <Iframe url={"http://" + window.location.hostname + ':8081/index.html'}
          height="600px"
          className="myClassname"
          display="initial"
          position="relative"
        />

      </Container>
    );
  }
}

export default MapPage;
