import React, { Component } from 'react';
import { Container, Jumbotron, Button, InputGroup, FormControl, Alert } from 'react-bootstrap';
import { sha256 } from 'js-sha256';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoginForm: true,
            hashword: null,
            username: null,
            popupName: "none"
        };
        this.passwordRef = React.createRef();
        this.usernameRef = React.createRef();
        this.verifyCodeRef = React.createRef();
    }

    handleLoginClick() {
        this.setState({ hashword: sha256(this.passwordRef.current.value.toString()), username: this.usernameRef.current.value.toString() }, () => {
            let bodyString = JSON.stringify({ username: this.state.username, hashword: this.state.hashword });
            fetch("http://" + window.location.hostname + ':8081/checkVerifyStatus', {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: bodyString
            })
                .then(response => response.json()).catch(reason => console.log(reason))
                .then((data) => {
                    if (data.message === "good") {
                        fetch("http://" + window.location.hostname + ':8081/login', {
                            method: "POST", headers: {
                                "Content-Type": "application/json",
                            }, body: bodyString
                        })
                            .then(response => response.json()).then((data) => {
                                if (data.message === "good") {
                                    window.localStorage.setItem('jwt', data["token"]);
                                    window.location = "/"
                                }else if(data.message === "bad"){
                                    this.setState({ popupName: "wrongPassword" });
                                }
                            });
                    } else if (data.message === "bad") {
                        this.usernameRef.current.value = "";
                        this.setState({ isLoginForm: false });
                    } else {
                        this.setState({ popupName: "noAccount" });
                    }
                });
        });
    }

    handleVerifyClick() {
        let bodyString = JSON.stringify({ username: this.state.username, hashword: this.state.hashword, code: this.verifyCodeRef.current.value });
        fetch("http://" + window.location.hostname + ':8081/verify', {
            method: "POST", headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }, body: bodyString
        })
            .then(response => response.json()).catch(reason => console.log(reason))
            .then((data) => {
                if (data.message === "good") {
                    this.verifyCodeRef.current.value = "";
                    this.setState({ isLoginForm: true, popupName: "correctCode" });
                } else {
                    this.setState({ popupName: "incorrectCode" });
                }
            });
    }

    render() {

        const popupIncorrectCode = (
            <Alert variant="danger">
                <Alert.Heading>Oh snap! That's the wrong code!</Alert.Heading>
            </Alert>
        );

        const popupWrongPassword = (
            <Alert variant="danger">
                <Alert.Heading>Incorrect Password! Is this really your account...James? We're watching you... <img src="/observerTexture.png"></img></Alert.Heading>
            </Alert>
        );

        const popupCorrectCode = (
            <Alert variant="success">
                <Alert.Heading>Account Verified! Proceed To Login With Your Credentials...</Alert.Heading>
            </Alert>
        );

        const popupNoAccount = (
            <Alert variant="primary">
                <Alert.Heading>No player with this username was found on the server. Make sure you login to the MC server first! Then check back here...</Alert.Heading>
            </Alert>
        );

        let thePopup = (<></>);

        if (this.state.popupName === "incorrectCode") {
            thePopup = popupIncorrectCode;
        }
        if (this.state.popupName === "correctCode") {
            thePopup = popupCorrectCode;
        }
        if (this.state.popupName === "noAccount") {
            thePopup = popupNoAccount;
        }
        if (this.state.popupName === "wrongPassword") {
            thePopup = popupWrongPassword;
        }

        const loginJumbotron = (
            <Jumbotron>
                <h1>Login / Signup</h1>
                <h5>
                    To login, fill in the information below. To SignUp, fill in your Minecraft username and your desired password.
                        </h5>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="mc-username">MC Username</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Large" ref={this.usernameRef} aria-describedby="mc-username" />
                </InputGroup>
                <br />
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="password" >Password</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Large" type="password" ref={this.passwordRef} aria-describedby="password" />
                </InputGroup>
                <br />
                <Button variant="primary" onClick={() => this.handleLoginClick()}>Login / SignUp</Button>
            </Jumbotron>
        );

        const loginVerification = (
            <Jumbotron>
                <h1>Verify Your Account</h1>
                <p>
                    Fill in your verification code below. Your verification code will be shown in chat when you login to the minecraft server.
                        </p>
                <InputGroup size="lg">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="code">Verification Code</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Large" ref={this.verifyCodeRef} aria-describedby="code" />
                </InputGroup>
                <br />
                <Button variant="success" onClick={() => this.handleVerifyClick()}>Verify My Account</Button>
            </Jumbotron>
        );

        return (
            <Container>
                <div>&nbsp;</div>
                {this.state.isLoginForm ? loginJumbotron : loginVerification}
                {thePopup}
            </Container>
        );
    }
}

export default Login;
