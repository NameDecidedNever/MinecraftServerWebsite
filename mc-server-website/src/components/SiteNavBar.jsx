import React, { Component } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';

class SiteNavBar extends Component {

  logout() {
    localStorage.removeItem('jwt');
    this.forceUpdate()
  }

  render() {

    let rightNavArea = <></>;
    console.log(window.localStorage.getItem('jwt'));
    if (window.localStorage.getItem('jwt') == null) {
      rightNavArea = (<Button href="login" variant="outline-success">Login</Button>)
    } else {
      rightNavArea = (<Button onClick={() => this.logout()} variant="outline-primary">Logout</Button>);
    }

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">NDN Minecraft</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="home">Home</Nav.Link>
            <Nav.Link href="map">Map</Nav.Link>
            <Nav.Link href="finance">Finance</Nav.Link>
            <Nav.Link href="players">Players</Nav.Link>
            <Nav.Link href="about">About</Nav.Link>
          </Nav>
          <Form inline>
            {rightNavArea}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default SiteNavBar;
