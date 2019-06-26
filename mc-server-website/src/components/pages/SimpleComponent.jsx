import React, { Component } from 'react';
import { Container, ProgressBar, Jumbotron, Button } from 'react-bootstrap';
import '../../App.css';

class SimpleComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      progressBarPercent : 10,
      coolMessage : "Hey, I'm a cool message"
    }
    this.addToProgressBar = this.addToProgressBar.bind(this);
  }

  addToProgressBar(){
    console.log("Hey, I'm being called!");
    this.setState({progressBarPercent : this.state.progressBarPercent + 10});
  }

  render() {

    let htmlToReturn = (<div>
      <Container>
        <br></br>
        <Jumbotron>
          <ProgressBar striped animated variant="primary" now={this.state.progressBarPercent}></ProgressBar>
          <br></br>
          {this.state.coolMessage}
          <br></br>
          <Button onClick={this.addToProgressBar} variant="dark">Click me!</Button>
        </Jumbotron>
      </Container>
    </div>);

    return (
      <div>
      {htmlToReturn}
      </div>
    );
  }
}

export default SimpleComponent;
