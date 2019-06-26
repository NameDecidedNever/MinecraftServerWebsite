import React, { Component } from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import YouTube from 'react-youtube';

class WelcomeJumbotron extends Component {
    render() {
        return (
            <>
                    <div>&nbsp;</div>
                    <Jumbotron>
                        <h1>Welcome!</h1>
                        <YouTube videoId={"PvnVVLxHM7w"}/>
                    </Jumbotron>
            </>
        );
    }
}

export default WelcomeJumbotron;
