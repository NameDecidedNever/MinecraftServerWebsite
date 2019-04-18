import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card } from 'react-bootstrap';
import { LineChart, Line, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import TokenManager from '../tokenManager';
import PleaseLogin from './PleaseLogin';
import PlayerProfilePic from './PlayerProfilePic';
import Loading from './Loading';

class TransactionGraph extends Component {


    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            data: []
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
                    let Bal = 0;
                    let xCoord = 0;
                    let newData = [];
                    data.forEach(element => {
                        xCoord += 20;
                        if (TokenManager.getLoggedInName() == element.recieverLabel.split("'")[0]) {
                            Bal += element.amount;
                        } else {
                            Bal -= element.amount;
                        }
                        
                        newData.push({balance: Bal.toFixed(2) });
                    });
                    this.setState({ data: newData });
                    this.setState({ ready: true });
                });
        }
    }


    render() {
        console.log("rendering...");
        let content = [];
        if (TokenManager.isLoggedIn()) {
            content = (
                <Card>
                    <Container>
                        &nbsp;
                        <h3>Account Balance v Time</h3></Container>
                    
                    <AreaChart width={630} height={450} data={this.state.data}
                        margin={{ top: 50, right: 30, left: 10, bottom: 10 }}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="balance" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
                    </AreaChart>
                </Card>);
            // if (!this.state.isReady) {
            //     content = (<Loading></Loading>);
            // }
        } else {
            content = (<PleaseLogin />);
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}

export default TransactionGraph;
