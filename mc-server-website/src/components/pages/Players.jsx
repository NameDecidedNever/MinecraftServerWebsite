import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card, Row } from 'react-bootstrap';
import Loading from '../Loading';
import DataManager from '../../dataManager';
import '../../App.css';
import {Animated} from "react-animated-css";
import '../../animate.min.css';
import TokenManager from '../../tokenManager';

class Players extends Component {

  constructor(props) {
    super(props);

    this.state = {
      players: undefined,
      isAnyPlayers: undefined,
      accounts: undefined,
      showPlaytime: false
    };
    this.showPlaytimeCheckbox = React.createRef();
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentDidMount() {
    if (TokenManager.isLoggedIn()) {
    DataManager.getDataFromEndpoint("players", {})
            .then(data => { this.setState({players : data, isAnyPlayers : data.length > 0}) });
    }
  }

  getPlayerCards() {
    
    let playerData = this.state.players;
    let playerCards = [];

    

    playerData.forEach((player, index) => {
      let playtimeCard = (<Badge variant="primary">{(player.secondsPlayed / 60 / 60).toFixed(1)} hours </Badge>);
      playerCards.push(
      <Animated animationIn="fadeIn" animationOut="flipOutY" animationInDelay={index * 40} animationInDuration={500}>
      <ListGroup.Item>
        {player.username}
        &nbsp;
        {player.isverified === 0 ? <Badge variant="danger">Not Verified</Badge> : <></>}
        <div className="float-right">
                       
                       {player.townName != undefined ? <Badge variant="success">
                            Resident Of {player.townName}
                        </Badge> : (<></>)}
                        &nbsp;
                        <Badge variant="primary">
                            ${player.balance.toFixed(2)}
                        </Badge>
                        &nbsp;
                        
                        {this.state.showPlaytime ? playtimeCard : (<></>)}
                        
        </div>
        </ListGroup.Item>
        </Animated>);
    });
    return (<ListGroup>{playerCards}</ListGroup>);
  }

  handleCheckboxChange(){
    //console.log("test");
    this.setState({showPlaytime : !this.state.showPlaytime});
  }

  render() {


    let content;

    if (this.state.players !== undefined) {
      content = this.getPlayerCards();
    } else {
      content = (<Loading />);
    }

    if (this.state.isAnyPlayers === false) {
      content = (<Card body>
        <Row className="justify-content-md-center">
          <h5> No players yet! Be the first to joing our server :D </h5>
        </Row>
      </Card>);
    }

    return ( 
      <Container>
        &nbsp;
          <h3> Players </h3>
          <h5>Show player playtime <input type="checkbox" ref={this.showPlaytimeCheckbox} onClick={this.handleCheckboxChange}></input></h5> 
        &nbsp;
          {content}
      </Container>
    );
  }
}

export default Players;
