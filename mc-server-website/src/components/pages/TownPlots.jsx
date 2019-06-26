import React, { Component } from 'react';
import { Container, ListGroup, Badge, Card, Alert, Row, Button, Jumbotron, Col, Modal, Form } from 'react-bootstrap';
import Loading from '../Loading';
import DataManager from '../../dataManager';
import TokenManager from '../../tokenManager';
import PleaseLogin from '../PleaseLogin';
import '../../App.css';
import {Animated} from "react-animated-css";

class TownPlots extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            town: undefined,
            isLoaded: false,
            hasPermissions: false,
            townName: this.props.match.params.name,
            showBuyModal: false,
            plots: undefined,
            currentPlotSelected: undefined,
            players: undefined
        };
        this.handleShowBuyModal = this.handleShowBuyModal.bind(this);
        this.handleBuyPlot = this.handleBuyPlot.bind(this);
        this.handleCloseBuyModal = this.handleCloseBuyModal.bind(this);
        this.handleEvict = this.handleEvict.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }

    refreshData() {
        DataManager.getDataFromEndpoint("towndetails", { townName: this.props.match.params.name })
            .then(data => {
                console.log(data); this.setState({ town: data[0] }, () => {
                    DataManager.getDataFromEndpoint("plots", { townName: this.props.match.params.name })
                        .then(plotData => {
                            console.log(plotData); this.setState({ plots: plotData },
                                () => {
                                    DataManager.getDataFromEndpoint("players", {})
                                        .then(playerData => {
                                            console.log(playerData);
                                            this.setState({ players: playerData, isLoaded: data != undefined },
                                                () => {
                                                    this.drawCanvas();
                                                });
                                        });
                                });
                        });
                });
            });
    }

    componentDidMount() {
        if (TokenManager.isLoggedIn()) {
            this.refreshData();
        }
    }

    handleShowBuyModal(index) {
        this.setState({ currentPlotSelected: this.state.plots[index], showBuyModal: true });
    }

    handleEvict(index) {
        DataManager.getDataFromEndpoint("evict", { plotid: this.state.plots[index].idplots, isEviction : TokenManager.getLoggedInName() == this.state.town.ownerName })
        .then(data => {
            this.refreshData();
            if (data.message == "bad") {
                window.alert("Error evicting player. Perhaps you don't own the town?");
            }
        });
    }

    handleDelete(index) {
        DataManager.getDataFromEndpoint("deleteplot", { plotid: this.state.plots[index].idplots })
        .then(data => {
            this.refreshData();
            if (data.message == "bad") {
                window.alert("Error deleting plot. Try refreshing the page and see if someone lives there...");
            }
        });
    }

    handleBuyPlot() {
        DataManager.getDataFromEndpoint("buyplot", { plotid: this.state.currentPlotSelected.idplots })
            .then(data => {
                this.setState({ showBuyModal: false });
                this.refreshData();
                if (data.message == "bad") {
                    window.alert("Could not purchase plot! Perhaps it has already been taken by another player.");
                }
            });
    }

    handleCloseBuyModal() {
        this.setState({ showBuyModal: false });
    }

    getTownPlotInfo() {
        let isTownOwner = TokenManager.getLoggedInName() == this.state.town.ownerName;
        let canRentMoreResidential = true;
        this.state.players.forEach((player) => {
            if(player.username == TokenManager.getLoggedInName()){
                if(player.townName != undefined){
                    canRentMoreResidential = false;
                }
            }
        });
        let plotCards = [];
        if(!canRentMoreResidential){
            plotCards.push(<Alert variant={"info"}>
                Note: You are already a resident of a town, and can now only purchase marketplace plots.
              </Alert>)
        }
        this.state.plots.forEach((plot, index) => {
            let renterOrPurchase = [];
            if(canRentMoreResidential || plot.type != 1){
            renterOrPurchase.push(<><Button disabled={plot.renterid != null} id={index} size="sm" variant="primary" onClick={() => { this.handleShowBuyModal(index) }}>
                {(plot.renterid != null) ? "Already Rented" : "Purchase"}
            </Button>&nbsp;</>);
            }
            if(isTownOwner && plot.renterid != null){
                renterOrPurchase.push(<Button id={index} size="sm" variant="danger" onClick={() => { this.handleEvict(index) }}>
                Evict
            </Button>);
            }else{
                let isMyRentedPlot = false;
                this.state.players.forEach((player) => {
                    if(player.idplayers == plot.renterid){
                        if(player.username == TokenManager.getLoggedInName()){
                            isMyRentedPlot = true;
                        }
                    }
                });
                if(isMyRentedPlot){
                    renterOrPurchase.push(<><Button id={index} size="sm" variant="danger" onClick={() => { this.handleEvict(index) }}>
                Leave My Plot
            </Button>&nbsp;</>);
            }else if(isTownOwner){
                renterOrPurchase.push(<>&nbsp;<Button id={index} size="sm" variant="dark" onClick={() => { this.handleDelete(index) }}>Delete This Plot</Button></>);
            }
        }
            var plotTypeName = (<Badge variant="success">
                Other
            </Badge>);
            if (plot.type == 1) {
                plotTypeName = (<Badge variant="success">
                    Residential
            </Badge>);
            } else if (plot.type == 2) {
                plotTypeName = (<Badge variant="primary">
                    Marketplace
                        </Badge>);
            }
            plotCards.push(
                <Animated animationIn="flipInX" animationInDelay={index * 80} animationOut="fadeOut">
                <ListGroup.Item>
                    <Badge variant="primary">
                        {index + 1}
                    </Badge>
                    &nbsp;
                    {plot.name}
                    <div className="float-right">
                        {plotTypeName}
                        &nbsp;
                        <Badge variant="primary">
                            ${plot.pricePerDay} / Day
                        </Badge>
                        &nbsp;
                       {renterOrPurchase}
                    </div>
                </ListGroup.Item>
                </Animated>
            );
        });
        return plotCards;
    }

    drawCanvas() {
        let canvas = document.getElementById("plotsCanvas");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#9bc1ff";
        //ctx.fillRect(0, 0, 150, 75);
        let centerX = this.state.town.centerX;
        let centerZ = this.state.town.centerZ;
        console.log("TownZ" + centerZ);
        let canvasCenterX = 100;
        let canvasCenterY = 100;
        ctx.fillStyle = "#d1d1d1";
        ctx.fillRect(0, 0, 200, 200);
        this.state.plots.forEach((plot, index) => {
            console.log(plot);
            if (plot.type == 2) {
                ctx.fillStyle = "#9bc1ff";
            } else {
                ctx.fillStyle = "#70c174";
            }
            ctx.fillRect((plot.x - centerX) + canvasCenterX, (plot.z - centerZ) + canvasCenterY, plot.width, plot.length);
            ctx.fillStyle = "#146dff";
            ctx.beginPath();
            // ctx.arc((plot.width / 2) + (plot.x - centerX) + canvasCenterX, (plot.length / 2) + (plot.z - centerZ) + canvasCenterY, 10, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "12px Arial";
            ctx.fillText(index + 1, (plot.width / 2) + (plot.x - centerX) + canvasCenterX - 5, (plot.length / 2) + (plot.z - centerZ) + canvasCenterY + 5);
        });
    }

    render() {

        if (!TokenManager.isLoggedIn()) {
            return (<Container>&nbsp;<PleaseLogin /></Container>);
          }

        let content;
        let plotInfo;

        if (this.state.isLoaded) {
            plotInfo = this.getTownPlotInfo();
            content = (<Container>
                &nbsp;
                <Jumbotron>
                    <h2>{this.state.town.name} - Plots</h2>
                    <canvas width={300} height={300} id={"plotsCanvas"}></canvas>
                    <ListGroup>
                        {plotInfo}
                    </ListGroup>
                </Jumbotron>
            </Container>);
        } else {
            content = (<Loading />);
        }


        let modal = (<></>);

        if (this.state.currentPlotSelected != undefined) {
            modal = (
                <Modal show={this.state.showBuyModal} onHide={this.handleCloseBuyModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Buy Plot</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you would like to purchase <b>{this.state.currentPlotSelected.name}</b>, a <Badge variant="success">{this.state.currentPlotSelected.type == 1 ? "Residential" : "Marketplace"}</Badge> plot for a price of  <Badge variant="primary">${this.state.currentPlotSelected.pricePerDay} / Day</Badge>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleCloseBuyModal}>
                            Nevermind
              </Button>
                        <Button variant="primary" onClick={this.handleBuyPlot}>
                            Yes, Purchase!
              </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        return (
            <>
                {content}
                {modal}
            </>
        );
    }
}

export default TownPlots;
