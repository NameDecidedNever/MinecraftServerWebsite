import React, { Component } from 'react';
import { Container, Card } from 'react-bootstrap';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import TokenManager from '../tokenManager';
import PleaseLogin from './PleaseLogin';
import DataManager from '../dataManager';


class TransactionGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            data: []
        };
        if (TokenManager.isLoggedIn()) {
            this.updateList();
        }
    }

    updateList() {
        DataManager.getDataFromEndpoint("transactions").then((data) => {
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

                    newData.push({ balance: Bal.toFixed(2) });
                });
                this.setState({ data: newData });
                this.setState({ ready: true });
            });
    }

    render() {
        let content = [];
        if (TokenManager.isLoggedIn()) {
            content = (
                <Card>
                    <Container>
                        &nbsp;
                        <h3>Account Balance v Time</h3></Container>

                    <AreaChart width={630} height={450} data={this.state.data}
                        margin={{ top: 50, right: 30, left: 10, bottom: 10 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="balance" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
                    </AreaChart>
                </Card>);
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
