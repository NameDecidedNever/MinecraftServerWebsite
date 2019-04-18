import React, { Component } from 'react';
import { Container,  Nav, Row, Col } from 'react-bootstrap';
import TokenManager from '../../tokenManager';
import PleaseLogin from '../PleaseLogin';
import TransactionList from '../TransactionList';
import TransactionGraph from '../TransactionGraph';
import Loans from '../Loans';
import Expenses from '../Expenses';

class Finance extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page : 'transactions'
    };
  }

  handleSelect(eventKey) {
    this.setState({page : eventKey});
    console.log("state set to " + eventKey);
  }

  render() {
    let content = <div></div>;
    if(this.state.page === "transactions"){
      content = (<Row><Col><TransactionList></TransactionList></Col>
        <Col><TransactionGraph></TransactionGraph></Col></Row>);
    }else if(this.state.page === "expenses"){
      content = <Expenses></Expenses>;
    }else{
      content = <Loans></Loans>;
    }
    if (!TokenManager.isLoggedIn()) {
      return (<Container>&nbsp;<PleaseLogin /></Container>);
    }
    return (
      <Container>
        &nbsp;
        <div style={{ "backgroundColor": "	#DCDCDC" }}>
          <Nav justify variant="tabs" defaultActiveKey="transactions" onSelect={k => this.handleSelect(k)}>
            <Nav.Item>
              <Nav.Link eventKey="transactions">Transactions</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="expenses">Expenses</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="loans">Loans</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="disabled" disabled>
                More Coming Soon!
    </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        &nbsp;
        {content}
      </Container>
    );
  }
}

export default Finance;
