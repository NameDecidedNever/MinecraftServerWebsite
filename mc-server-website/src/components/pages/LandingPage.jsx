import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import '../../App.css';
import SiteNavBar from '../../components/SiteNavBar';
import WelcomeJumbotron from '../../components/WelcomeJumbotron';

class LandingPage extends Component {
  render() {
    return (
      <>
        <Container>
          <Row className="justify-content-md-center">
           <Col xs={8}>
              <WelcomeJumbotron/>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default LandingPage;
