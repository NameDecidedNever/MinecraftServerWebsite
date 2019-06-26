import React, { Component } from 'react';
import { Container, Card, Row, Badge, Jumbotron, Button, Col, ListGroup, Alert, Accordion } from 'react-bootstrap';
import DataManager from '../../../dataManager';
import MathJax from 'react-mathjax';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

class ReleaseBlog extends Component {

  constructor(props) {
    super(props);

    this.state = {
        constants : undefined
    }

    DataManager.getDataFromEndpoint("constants").then((data) => {
        this.setState({ constants : data }, () => {
            console.log(this.state.constants);
        });
      });

  }

 
  render() {

    return (
      <Container>
        &nbsp;
        <Jumbotron>
        <ListGroup variant="flush">
            <ListGroup.Item>

              <h1>Release v1.0</h1>
              <p>
                A brave new world begins!
            </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                Welcome to the official v1.0 release of NDN Minecraft! We're very excited to have you, and look forward to an entertaining summer full of updates and exploration.
            </p>
            <p>
                This first blog will serve as a tutorial for new players, and outline all of the Release v1.0 features of NDN Minecraft.
            </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>The Website</h3>
              <p>Congrats! If you're reading this you've successfully navigated to the NDN Minecraft website! You'll be using this site a lot when playing on our server. In order to fully
                  take advantage of the website, you'll need to verify your Minecraft account. Log into the Minecraft Server to recieve a verification code.
                  </p>
                  <img src="/blog/release/VerificationCode.png" width={600}></img> 
                  <br></br><br></br>
                  <p>            
                   After recieving your verification code, press the Login button in the top right of the website, and fill in your Minecraft username and <b>desired website password. </b>
                   Then, you will be prompted to input your verification code. Once this is done, you'll be verified and ready to login to the NDN Minecraft website using your Minecraft username
                   and website password.
                </p>
                <Alert variant={"info"}>
                Note: NDN Minecraft website passwords are <b>never seen by the server staff, </b> and are hashed before being entered into the database!
              </Alert>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Your Server Bank Account</h3>
              <p>Being an Economy Server, every player will have a server bank account. You can view your balance by using the <b>/account bal</b> command.
                  </p>
                  <img src="/blog/release/AccountBal.png" width={600}></img> 
                  <br></br><br></br>
                  <p>            
                   Payments can be made between players using the <b>/pay [username] [amount]</b> command. Payments are taxed by the server bank if the player you are paying is 
                   not a resident of the same town as you. More about towns will be discussed later!
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Server Taxes</h3>
              <p>The server maintains a bank account just like every player. This bank account recieves revanue by taxing players. Server taxes are usually very small, but
                  are implemented in a variety of commands. Why does the server need money? Where do these taxes go? That's where Mob Killing profits come in...
                  </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Mob Killing = $$$</h3>
              <p>The money stored in the server bank account is dealt out when players kill mobs. This helps new players earn money, and keeps taxed dollars in circulation. When you kill
                  a mob, you recieve a reward proportional to both the mob's health, and the current money in the server bank account. 
                  </p>
                  <Accordion defaultActiveKey="0">
  <Card>
    <Card.Header>
      <Accordion.Toggle as={Button} variant="link" eventKey="1">
        So...can't I just kill mobs and make the server bankrupt?
      </Accordion.Toggle>
    </Card.Header>
    <Accordion.Collapse eventKey="1">
      <Card.Body>Why, I'm glad you asked! Due to the fact that the money you recieve is proportional to the money left in the server bank account, the amount of money you recieve
          over time decreases as the server account is depleated.

          From this information, we conclude that the rate of making money for your account follows this law:

          <BlockMath
    math={'\\frac{dM}{dt} = C\\cdot S(t)'}
    errorColor={'#cc0000'}
  />

      Where M(t) is your money with respect to time, S(t) is the money in the server bank account at time t, and C is some arbitrary constant. 
      We must also notice that the derivitive of your account will be the negative derivitive of the server account, as when you gain money, 
      the server looses that same amount of money.

      <BlockMath
    math={'\\frac{dM}{dt} = -\\frac{dS}{dt}'}
    errorColor={'#cc0000'}
    />

    Therefore, through substitution, it follows that...

    <BlockMath
    math={'-\\frac{dS}{dt} = C\\cdot S(t)'}
    errorColor={'#cc0000'}
    />

      In order to get your money with respect to time, we can integrate both sides of this first order ordinary differential equation... 


      <BlockMath
    math={'-\\int \\frac{dS}{dt} = \\int C\\cdot S(t)'}
    errorColor={'#cc0000'}
  />

  Seperating the variables...
  <BlockMath
    math={'-\\int \\frac{1}{S(t)}\\cdot dS = \\int C\\cdot{dt}'}
    errorColor={'#cc0000'}
  />

<BlockMath
    math={'-ln(S) = C\\cdot t'}
    errorColor={'#cc0000'}
  />

<BlockMath
    math={'e^{ln(S)} = e^{C\\cdot -t}'}
    errorColor={'#cc0000'}
  />

<BlockMath
    math={'S = C\\cdot e^{-t}'}
    errorColor={'#cc0000'}
  />

  So, in conclusion, the money in the server bank account follows this formula, where t, the time, represents how many mob kills drain the money.
  <BlockMath
    math={'S(t) = C\\cdot e^{-t}'}
    errorColor={'#cc0000'}
  />

  So while yes, <InlineMath
    math={'\\lim_{t\\to\\infty} S(t) = 0'}
    errorColor={'#cc0000'}
  />, the server bank account will never actually reach zero, as <InlineMath
  math={'S(t) = C\\cdot e^{-t}'}
  errorColor={'#cc0000'}
/> never reaches zero for any value of t. In other words, you can always count on mob kills giving you some money, even if it is only a fraction of a cent...

      </Card.Body>
    </Accordion.Collapse>
  </Card>
</Accordion>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Towns</h3>
              <p>Towns are a great way for you to earn money while providing a comfortable living enviornment for your fellow players. Remember, <b>town creation isn't for everyone</b>, in fact
              its quite expenseive. If you're not up for the time comitment involved in running a town, consider joining someone else's town by purchasing a residential plot.
              </p>

              <p>
                To create your very own town, use the command <b>/town found [townName]</b>. This will create a town centered at where you are standing. After creating a town, we recommend
                visiting the towns page on the website to setup your taxing policies for your town. First, login to the website, then navigate to Towns, and click "Manage" on your town.
              </p>
              <img src="/blog/release/TownTaxesPage.png" width={600}></img>
              <p>
                From here you can edit the town taxes. The mob kill tax gives 
              </p>
            </ListGroup.Item>
        </ListGroup>
        </Jumbotron>
      </Container>
    );
  }
}

export default ReleaseBlog;
