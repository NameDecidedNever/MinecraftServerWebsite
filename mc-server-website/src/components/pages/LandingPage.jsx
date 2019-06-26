import React, { Component } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import '../../App.css';
import WelcomeJumbotron from '../../components/WelcomeJumbotron';
import {Animated} from "react-animated-css";
import '../../animate.min.css';

class LandingPage extends Component {
  render() {
    return (
      <>
      <Animated animationIn="fadeIn" animationOut="flipOutY" animationInDelay={20} animationInDuration={1000}>
        <Container>
          <Row className="justify-content-md-center">
           <Col xs={8}>
              <WelcomeJumbotron/>
            </Col>
          </Row>
        </Container>
        </Animated>
      </>
    );
  }
}

export default LandingPage;
