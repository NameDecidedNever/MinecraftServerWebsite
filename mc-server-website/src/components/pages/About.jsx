import React, { Component } from 'react';
import { Container, Card, Row, Badge, Jumbotron, Button, Col, ListGroup } from 'react-bootstrap';
import '../../App.css';
import DataManager from '../../dataManager';
import Loading from '../Loading';

class About extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      currentPlayers: 0,
      maxPlayers: 0,
      transactionsFufilled: 0,
      serverBankAccount: 0
    }

    this.handleUpdate();

  }

  handleUpdate() {
    DataManager.getDataFromEndpoint("about").then((data) => {
      this.setState({ currentPlayers: data[0].currentPlayersOnline, maxPlayers: data[0].maxPlayersOnline, transactionsFufilled : data[0].transactionsFufilled, serverBankAccount : data[0].serverBankAccount, isReady: true });
    });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <Container>
          &nbsp;
          <Loading></Loading>
        </Container>
      )
    }
    let currentPlayerBadgeVarient = this.state.currentPlayers > 0 ? "success" : "secondary";
    let transactionsFufilledBadgeVarient = this.state.transactionsFufilled > 0 ? "success" : "secondary";
    return (
      <Container>
        &nbsp;
        <Jumbotron>
        <ListGroup variant="flush">
  <ListGroup.Item>

          <h1>About NDN Minecraft</h1>
          <p>
            Hopefully James isn't cheating...
            </p> 
  </ListGroup.Item>
  <ListGroup.Item>
  <Row>
              <Col>
                <h3> Players Online <Badge variant={currentPlayerBadgeVarient}>{this.state.currentPlayers} </Badge> </h3>
              </Col>
              <Col>
                <h3> Lifetime Player Peak <Badge variant="primary">{this.state.maxPlayers} </Badge></h3>
              </Col>
          </Row>
          &nbsp;
          <Row>
              <Col>
                <h3> Transactions Fufilled <Badge variant={transactionsFufilledBadgeVarient}>{this.state.transactionsFufilled} </Badge> </h3>
              </Col>
              <Col>
                <h3> Server Bank Account <Badge variant="success">${this.state.serverBankAccount.toFixed(2)} </Badge></h3>
              </Col>
          </Row>
          </ListGroup.Item>
</ListGroup>
        </Jumbotron>
      </Container>
    );
  }
}

export default About;
