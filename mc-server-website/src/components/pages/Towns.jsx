import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card, Row, Button } from 'react-bootstrap';
import Loading from '../Loading';
import DataManager from '../../dataManager';
import TokenManager from '../../tokenManager';
import {Animated} from "react-animated-css";
import '../../App.css';

class Towns extends Component {

    constructor(props) {
        super(props);

        this.state = {
            towns: undefined,
            isAnyTowns: undefined
        };
    }

    componentDidMount() {
        DataManager.getDataFromEndpoint("towns")
            .then(data => this.setState({ towns: data, isAnyTowns: data.length > 0 }));
    }

    getTownCards() {
        let townData = this.state.towns;
        let townCards = [];
        townData.forEach((town) => {
            let isMyTown = TokenManager.getLoggedInName() === town.ownerName;
            if(town.isQuestTown == 0){
            townCards.push(
                <ListGroup.Item>
                    <Animated animationIn="fadeIn" animationOut="fadeOut">
                    <h4>{town.name}</h4>
                    <div className="float-right">
                    <Button variant="primary" href={"/townplots/" + town.name}> 
                            View Plots
                        </Button> 
                        &nbsp;
                    {isMyTown ? <Button variant="success" href={"/managetown/" + town.name}> 
                            Manage
                        </Button> : ""}  
                    </div>
                    Est. {(new Date(town.dateFounded * 1000).getMonth() + 1) + "/" + new Date(town.dateFounded * 1000).getDate() +  "/" + new Date(town.dateFounded * 1000).getFullYear()}
                </Animated>
                </ListGroup.Item>
            );
            }
        });
    
        return (<ListGroup>{townCards}</ListGroup>);
    }

    render() {

        let content;

        if (this.state.towns !== undefined) {
            content = this.getTownCards();
        } else {
            content = (<Loading />);
        }

        if (this.state.isAnyPlayers === false) {
            content = (<Card body>
                <Row className="justify-content-md-center">
                    <h5> No towns founded yet! Be the first to establish civilization! :D </h5>
                </Row>
            </Card>);
        }

        return (
            <Container>
                &nbsp;
          <h3> Towns </h3>
                &nbsp;
          {content}
            </Container>
        );
    }
}

export default Towns;
