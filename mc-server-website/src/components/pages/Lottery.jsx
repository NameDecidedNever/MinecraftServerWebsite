import React, { Component } from 'react';
import { Container, Card, Row, Badge, Jumbotron, Button, Col, ListGroup } from 'react-bootstrap';
import '../../App.css';
import DataManager from '../../dataManager';
import Roulette from '../../react-roulette-wheel/src/Roulette.jsx';

class Lottery extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      currentPlayers: 0,
      maxPlayers: 0,
      transactionsFufilled: 0,
      serverBankAccount: 0
    }

    //this.handleUpdate();

  }

  handleUpdate() {
    DataManager.getDataFromEndpoint("about").then((data) => {
      this.setState({ currentPlayers: data[0].currentPlayersOnline, maxPlayers: data[0].maxPlayersOnline, transactionsFufilled : data[0].transactionsFufilled, serverBankAccount : data[0].serverBankAccount, isReady: true });
    });
  }

  render() {

    const options = [
      "+$20",
      "+$30",
      "+$100",
      "-$20",
      "-$30",
      "-$100"
    ];

    return (
      <Container>
        &nbsp;
        <Jumbotron>
          <Roulette options={options} baseSize={200} onComplete={() => {}}></Roulette>
        </Jumbotron>
      </Container>
    );
  }
}

export default Lottery;
