import React, { Component } from 'react';
import { Card, Row, ListGroup, Badge } from 'react-bootstrap';
import Loading from './Loading';
import TokenManager from '../tokenManager';
import DataManager from '../dataManager';

class Expenses extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expensesDOM: (<></>),
            hasExpenses: true,
            isLoading: true
        }
        if (TokenManager.isLoggedIn()) {
            this.loadExpenses();
        }
    }

    loadExpenses(){
        let expensesDOM = [];
        DataManager.getDataFromEndpoint("expenses").then((data) => {
            let DOMKey = 0;
            if(data.length > 0){
            data.forEach(element => {
                expensesDOM.push(
                    <ListGroup.Item key={DOMKey}>
                        <div className="float-right">
                            <Badge variant="danger">
                                ${element.amount.toFixed(2)} / day
                            </Badge>
                        </div>
                        {element.message}
                    </ListGroup.Item>);
                DOMKey++;
            });
        }else{
            this.setState({hasExpenses : false});
        }
            this.setState({ expensesDOM: (<ListGroup variant="flush">{expensesDOM}</ListGroup>), isLoading: false });
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Loading></Loading>
            );
        } else if (!this.state.hasExpenses) {
            return (
                <Card body>
                    <Row className="justify-content-md-center">
                        No expenses on this account yet. Yay <span> 🎉 </span>
                    </Row>
                </Card>
            );
        }
        return (
            <>{this.state.expensesDOM}</>
        );
    }
}

export default Expenses;
