import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card, Row, Button, Jumbotron, Col, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
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
            showTaxModal: false,
            showMotdModal: false
        };
        this.handleShowTaxModal = this.handleShowTaxModal.bind(this);
        this.handleNewTaxInfo = this.handleNewTaxInfo.bind(this);
        this.handleCloseTaxModal = this.handleCloseTaxModal.bind(this);
        this.handleShowMotdModal = this.handleShowMotdModal.bind(this);
        this.handleNewMotd = this.handleNewMotd.bind(this);
        this.handleCloseMotdModal = this.handleCloseMotdModal.bind(this);
        this.handleClickAllowResidentsToEditTown = this.handleClickAllowResidentsToEditTown.bind(this);
        this.handleClickDisallowResidentsToEditTown = this.handleClickDisallowResidentsToEditTown.bind(this);
        this.mobTax = React.createRef();
        this.chestTax = React.createRef();
        this.warpTax = React.createRef();
        this.townSlogan = React.createRef();
    }

    componentDidMount() {
        DataManager.getDataFromEndpoint("towndetails", { townName: this.props.match.params.name })
            .then(data => { console.log(data); this.setState({ town: data[0], isLoaded: data != undefined }); });
    }

    handleShowTaxModal() {
        this.setState({ showTaxModal: true });
    }

    handleNewTaxInfo() {
        let prevTown = this.state.town;
        let newTown = prevTown;
        if(!(this.mobTax.current.value == null || this.mobTax.current.value === undefined ||  this.mobTax.current.value < 0 ||  this.mobTax.current.value > 100 || isNaN(this.mobTax.current.value))){
        newTown.mobKillTaxPerc = this.mobTax.current.value.replace(/\D/g,'') / 100;
        }
        if(!(this.chestTax.current.value == null || this.chestTax.current.value === undefined || this.chestTax.current.value < 0 || this.chestTax.current.value > 100 || isNaN(this.chestTax.current.value))){
        newTown.chestShopTaxPerc = this.chestTax.current.value.replace(/\D/g,'') / 100;
        }
        if(!(this.warpTax.current.value == null || this.warpTax.current.value === undefined || this.warpTax.current.value < 0 || this.warpTax.current.value > 100 || isNaN(this.warpTax.current.value))){
        newTown.warpTaxPerc = this.warpTax.current.value.replace(/\D/g,'') / 100;
        }
        this.setState({ showTaxModal: false, town: newTown });
        DataManager.getDataFromEndpoint("updateTownTaxes", { town: this.state.town })
            .then(data => {  });
    }

    handleCloseTaxModal() {
        this.setState({ showTaxModal: false });
    }

    handleShowMotdModal() {
        this.setState({ showMotdModal: true });
    }

    handleNewMotd() {
        let prevTown = this.state.town;
        let newTown = prevTown;
        newTown.motd = this.townSlogan.current.value;
        this.setState({ showMotdModal: false, town: newTown });
        DataManager.getDataFromEndpoint("updatemotd", { town: this.state.town })
            .then(data => { if(data.message != undefined && data.message == "bad"){
                alert("Could set town slogan...try using more standard characters...");
            }  });
    }

    handleCloseMotdModal() {
        this.setState({ showMotdModal: false });
    }

    handleClickAllowResidentsToEditTown(){
        console.log("Allow");
        let tempTown = this.state.town;
        tempTown.allowResidentsToEditTown = 0;
        DataManager.getDataFromEndpoint("setResidentsCanEditTown", { townName: this.props.match.params.name, allowResidentsToEditTown : false })
        .then(data => { console.log(data); this.setState({town : tempTown}); });
    }

    handleClickDisallowResidentsToEditTown(){
        console.log("Disallow");
        let tempTown = this.state.town;
        tempTown.allowResidentsToEditTown = 1;
        DataManager.getDataFromEndpoint("setResidentsCanEditTown", { townName: this.props.match.params.name, allowResidentsToEditTown : true })
        .then(data => { console.log(data); this.setState({town : tempTown}); });
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
                                    Allow Residents to Edit Town Area
                                     <div className="float-right">
                                    {!!this.state.town.allowResidentsToEditTown &&
                                        <Button variant="danger" onClick={this.handleClickAllowResidentsToEditTown}>Disallow</Button>
                                    }
                                     &nbsp;
                                     {!!!this.state.town.allowResidentsToEditTown &&
                                        <Button variant="success" onClick={this.handleClickDisallowResidentsToEditTown}>Allow</Button>
                                    }
                                    </div>
                                </h4>
                            </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                            <Col>
                                <h4>Town Slogan
                                <div className="float-right">"{this.state.town.motd}"</div>
                                </h4>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <Button onClick={this.handleShowTaxModal}>Edit Taxes</Button>
                                <Button onClick={this.handleShowMotdModal} style={{ "margin": "10px" }} >Edit Town Slogan</Button>
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

        if(this.state.isLoaded){
            if(!(TokenManager.getLoggedInName() == this.state.town.ownerName)){
                return(<Container><br></br><Jumbotron>
                <h3>Did you seriously just try and edit the settings on someone else's town?</h3>
                <h5>Not cool...</h5>
            </Jumbotron>
            </Container>);
            }
    }

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
                      Mob Kill Tax Percentage  <input ref={this.mobTax}></input> %
                      <br></br>
                      <br></br>
                      Chest Shop Tax Percentage  <input ref={this.chestTax}></input> %
                      <br></br>
                      <br></br>
                      Warp Tax Percentage  <input ref={this.warpTax}></input> %
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


                <Modal show={this.state.showMotdModal} onHide={this.handleCloseMotdModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Town Slogan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <input size="35" maxlength="35" ref={this.townSlogan}></input>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseMotdModal}>
                            Close
              </Button>
                        <Button variant="primary" onClick={this.handleNewMotd}>
                            Save Changes
              </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default ManageTown;
