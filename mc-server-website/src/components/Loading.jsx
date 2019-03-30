import React, { Component } from 'react';
import { Card, Row, Spinner } from 'react-bootstrap';

class Loading extends Component {
    render() {
        return (
            <Card body>
                <Row className="justify-content-md-center">
                    <Spinner animation="grow" />
                </Row>
                <Row className="justify-content-md-center">
                    <h5> Loading </h5>
                </Row>
            </Card>
        );
    }
}

export default Loading;
