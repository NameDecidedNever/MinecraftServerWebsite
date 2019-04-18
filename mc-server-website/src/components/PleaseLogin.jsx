import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class PleaseLogin extends Component {
    render() {
        return (
            <Alert variant="danger">
                <Alert.Heading>Please login to view this page!</Alert.Heading>
            </Alert>
        );
    }
}

export default PleaseLogin;
