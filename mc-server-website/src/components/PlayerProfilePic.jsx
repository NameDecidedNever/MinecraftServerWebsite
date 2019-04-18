import React, { Component } from 'react';
import ProcessImage from 'react-imgpro';
import Loading from '../components/Loading';
var Jimp = require('jimp');

class PlayerProfilePic extends Component {


    constructor(props) {
        super(props);

        this.state = {
            imageUrl: null,
            jimpImage: null,
            src: '',
            err: null
        };
        this.updatePic();
    }

    updatePic() {
        fetch("http://" + window.location.hostname + ':8081/requestUpdateImageCache', {
            method: "POST", mode: "no-cors", body : {username : this.props.username}
        }).then(response => response.json()).catch(reason => console.log(reason));
    }

render() {
    if (this.state.imageBlob != null) {
        return (
            <ProcessImage
                image={this.state.imageBlob}
                resize={{ width: 500, height: 500 }}
                crop={{ width: 16, height: 16, x: 32, y: 32 }}
                greyscale={true}
                colors={{
                    mix: {
                        color: 'mistyrose',
                        amount: 20
                    }
                }}
                processedImage={(src, err) => this.setState({ src, err })}
            />
        );
    } else {
        return (<Loading></Loading>);
    }
}
}

export default PlayerProfilePic;
