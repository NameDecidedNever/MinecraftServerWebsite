import React, { Component } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import TokenManager from '../tokenManager';
import PleaseLogin from './PleaseLogin';
import Loading from './Loading';
import DataManager from '../dataManager';

class TransactionList extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            transactions: (<></>)
        };
        if (TokenManager.isLoggedIn()) {
            this.updateList();
        }
    }


    updateList() {
        let transactionsDOM = [];
        DataManager.getDataFromEndpoint("transactions").then((data) => {
            let DOMKey = 0;
            data.reverse().forEach(element => {
                let badgeVar = "danger";
                if (TokenManager.getLoggedInName() === element.recieverLabel.split("'")[0]) {
                    badgeVar = "success";
                }
                transactionsDOM.push(
                    <ListGroup.Item key={DOMKey}>
                        <h6>{element.senderLabel} ➜ {element.recieverLabel}</h6>
                        <div className="float-right">
                            <Badge variant={badgeVar}>
                                ${element.amount.toFixed(2)}
                            </Badge>
                        </div>
                        {element.message}
                    </ListGroup.Item>);
                DOMKey++;
            });
            this.setState({ transactions: (<ListGroup variant="flush">{transactionsDOM}</ListGroup>), isReady: true });
        });
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
            <div height={100} style={{ "overflowY": "auto", "maxHeight": "600px" }}>
                {content}
            </div>
        );
    }
}

export default TransactionList;
