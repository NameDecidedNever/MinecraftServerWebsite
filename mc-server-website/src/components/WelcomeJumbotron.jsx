import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';

class WelcomeJumbotron extends Component {
    render() {
        return (
            <>
                    <div>&nbsp;</div>
                    <Jumbotron>
                        <h1>Welcome!</h1>
                        <p>
                            This website is still in heavy development. To help suggust features and submit bugs, please see the links below!
                        </p>
                        <Button variant="primary" href="https://trello.com/b/Va4IahYE/mc-server-devolopment">Trello Board</Button>
                        <div>&nbsp;</div>
                        <Button variant="primary" href="https://github.com/NameDecidedNever/MinecraftServerWebsite/issues">GitHub Issues</Button>
                    </Jumbotron>
            </>
        );
    }
}

export default WelcomeJumbotron;
