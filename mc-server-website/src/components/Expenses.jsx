import React, { Component } from 'react';
import { Card, Row, Spinner } from 'react-bootstrap';

class Expenses extends Component {
    render() {
        return (
            <Card body>
                <Row className="justify-content-md-center">
                   No expenses on this account yet. Yay 🎉
                </Row>
            </Card>
        );
    }
}

export default Expenses;
