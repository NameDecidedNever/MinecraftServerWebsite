import React, { Component } from 'react';
import { Container, Jumbotron, Button, InputGroup, FormControl } from 'react-bootstrap';

class Login extends Component {
    render() {
        return (
            <Container>
                <div>&nbsp;</div>
                <Jumbotron>
                    <h1>Login / Signup</h1>
                    <p>
                        To login, fill in the information below. To SignUp, fill in your Minecraft username and your desired password.
                        </p>
                    <InputGroup size="lg">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-medium">MC Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                    </InputGroup>
                    <br/>
                    <InputGroup size="lg">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-medium">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                    </InputGroup>
                    <br/>
                    <Button variant="primary" href="https://trello.com/b/Va4IahYE/mc-server-devolopment">Login / SignUp</Button>
                </Jumbotron>
            </Container>
        );
    }
}

export default Login;
