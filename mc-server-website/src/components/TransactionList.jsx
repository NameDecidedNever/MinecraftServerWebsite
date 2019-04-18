import React, { Component } from 'react';
import { Container, ListGroup, Badge } from 'react-bootstrap';
import TokenManager from '../tokenManager';
import PleaseLogin from './PleaseLogin';
import PlayerProfilePic from './PlayerProfilePic';
import Loading from './Loading';

class TransactionList extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            transactions: (<></>)
        };
        this.updateList();
    }


    updateList() {
        if (TokenManager.isLoggedIn()) {
            let transactionsDOM = [];
            fetch("http://" + window.location.hostname + ':8081/transactions', {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: TokenManager.getTokenToSend().toString()
            })
                .then(response => response.json()).catch(reason => console.log(reason))
                .then((data) => {
                    data.reverse().forEach(element => {
                        let badgeVar = "danger";
                        if (TokenManager.getLoggedInName() == element.recieverLabel.split("'")[0]) {
                            badgeVar = "success";
                        }
                        transactionsDOM.push(
                            <ListGroup.Item>
                                <h6>{element.senderLabel} ➜ {element.recieverLabel}</h6>
                                <div className="float-right">
                                    <Badge variant={badgeVar}>
                                        ${element.amount.toFixed(2)}
                                    </Badge>
                                </div>
                                {element.message}
                            </ListGroup.Item>);
                    });
                    this.setState({ transactions: (<ListGroup variant="flush">{transactionsDOM}</ListGroup>), isReady: true });
                });
        }
    }


    render() {
        let content = [];
        if (TokenManager.isLoggedIn()) {
            content = this.state.transactions;
            if (!this.state.isReady) {
                content = (<Loading></Loading>);
            }
        } else {
            content = (<PleaseLogin />);
        }
        return (
            <div height={100} style={{"overflow-y":"auto", "max-height" : "600px"}}>
                {content}
            </div>
        );
    }
}

export default TransactionList;
