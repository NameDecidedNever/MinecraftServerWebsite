import React, { Component } from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import Loading from '../Loading';
import '../../App.css';

class Players extends Component {

  constructor(props) {
    super(props);

    this.state = {
      players: undefined,
    };
  }

  componentDidMount() {
    fetch("http://" + window.location.hostname + ':8081/players')
      .then(response => response.json()).catch(reason => console.log(reason))
      .then(data => this.setState({ players : data }));
  }

  getPlayerCards(){
    let playerData = this.state.players;
    let playerCards = [];
    playerData.forEach((player) => {
      playerCards.push(<ListGroup.Item>{player.username}&nbsp;{player.isverified === 0 ? <Badge variant="danger">Not Verified</Badge> : <></>}</ListGroup.Item>);
    });
    return (<ListGroup>{playerCards}</ListGroup>);
  }

  render() {

    let content;

    if (this.state.players !== undefined){
      content = this.getPlayerCards();
    }else{
      content = (<Loading/>);
    }

    return (
        <Container>
          &nbsp;
          <h2> Players </h2>
          &nbsp;
          {content}
        </Container>
    );
  }
}

export default Players;
