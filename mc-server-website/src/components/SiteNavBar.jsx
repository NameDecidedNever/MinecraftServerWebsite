import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

class SiteNavBar extends Component {
  render() {
    return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">NDN Minecraft</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Map</Nav.Link>
              <Nav.Link href="#link">Finance</Nav.Link>
              <Nav.Link href="#link">Players</Nav.Link>
              <Nav.Link href="#link">About</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="MC Username" className="mr-sm-2" />
              <Button variant="outline-success">Find</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
    );
  }
}

export default SiteNavBar;
