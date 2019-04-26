import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card, Row, Button, Jumbotron, Col, Modal, Form } from 'react-bootstrap';
import Loading from '../Loading';
import DataManager from '../../dataManager';
import TokenManager from '../../tokenManager';
import '../../App.css';

class ManageTown extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            town: undefined,
            isLoaded: false,
            hasPermissions: false,
            townName: this.props.match.params.name,
            showTaxModal: false
        };
        this.handleShowTaxModal = this.handleShowTaxModal.bind(this);
        this.handleNewTaxInfo = this.handleNewTaxInfo.bind(this);
        this.handleCloseTaxModal = this.handleCloseTaxModal.bind(this);
    }

    componentDidMount() {
        DataManager.getDataFromEndpoint("towndetails", { townName: this.props.match.params.name })
            .then(data => { console.log(data); this.setState({ town: data[0], isLoaded: data != undefined }); });
    }

    handleShowTaxModal() {
        this.setState({ showTaxModal: true });
    }

    handleNewTaxInfo() {
        this.setState({ showTaxModal: false });
    }

    handleCloseTaxModal() {
        this.setState({ showTaxModal: false });
    }

    getTownTaxInfo() {
        let townData = this.state.towns;
        let taxCards = [];
        taxCards.push(
            <Jumbotron>
                <ListGroup variant="flush">
                    <ListGroup.Item>

                        <h1>
                            {this.state.town.name}
                            <div className="float-right">
                                <Badge variant="success" style={{ "margin": "10px" }}>
                                    Radius {this.state.town.radius}
                                </Badge>
                            </div>
                            &nbsp;
                            <div className="float-right">
                                <Badge variant="success" style={{ "margin": "10px" }}>
                                    Population 0
                                </Badge>
                            </div>
                        </h1>
                        <p>
                            Est. {(new Date(this.state.town.dateFounded * 1000).getMonth() + 1) + "/" + new Date(this.state.town.dateFounded * 1000).getDate() + "/" + new Date(this.state.town.dateFounded * 1000).getFullYear()}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>
                                    Mob Kill Tax
                                     <div className="float-right">
                                        <Badge variant="primary">
                                            {(this.state.town.mobKillTaxPerc * 100).toFixed(2)}%
                                        </Badge>
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>
                                    Chest Shop Tax
                                     <div className="float-right">
                                        <Badge variant="primary">
                                            {(this.state.town.chestShopTaxPerc * 100).toFixed(2)}%
                                        </Badge>
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>
                                    Warp Tax
                                     <div className="float-right">
                                        <Badge variant="primary">
                                            {(this.state.town.warpTaxPerc * 100).toFixed(2)}%
                                        </Badge>
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>
                                    Auction Tax
                                     <div className="float-right">
                                        <Badge variant="primary">
                                            {(this.state.town.auctionTaxPerc * 100).toFixed(2)}%
                                        </Badge>
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>
                                    Shipping Tax
                                     <div className="float-right">
                                        <Badge variant="primary">
                                            {(this.state.town.shippingTaxPerc * 100).toFixed(2)}%
                                        </Badge>
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <Button onClick={this.handleShowTaxModal}>Edit Taxes</Button>
                                <Button disabled style={{ "margin": "10px" }} >Edit Boundries</Button>
                                <Button disabled>Town Perks</Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>

            </Jumbotron>
        )
        return taxCards;
    }

    render() {

        let content;
        let taxInfo;

        if (this.state.isLoaded) {
            taxInfo = this.getTownTaxInfo();
        } else {
            content = (<Loading />);
        }

        return (
            <>
                <Container>
                    &nbsp;
          {content}
                    {taxInfo}
                </Container>
                <Modal show={this.state.showTaxModal} onHide={this.handleCloseTaxModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Taxes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group as={Row} controlId="formPlaintextPassword">
                                <Form.Label column sm="6">
                                    Mob Kill Tax
                            </Form.Label>
                                <Col sm="10">
                                    <Form.Control type="number" />
                                </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseTaxModal}>
                            Close
              </Button>
                        <Button variant="primary" onClick={this.handleNewTaxInfo}>
                            Save Changes
              </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ManageTown;
