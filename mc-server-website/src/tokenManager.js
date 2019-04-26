let jwt = require('jsonwebtoken');

export default {
    isLoggedIn(){
        return (window.localStorage.getItem('jwt') != null);
    },
    getLoggedInName(){
        if(this.isLoggedIn()){
            return jwt.decode(window.localStorage.getItem('jwt')).username;
        }else{
            return "";
        }
    },
    getTokenToSend(){
        if(this.isLoggedIn()){
            return JSON.stringify({"token" : window.localStorage.getItem('jwt')});
        }else{
            return JSON.stringify([]);
        }
    },
    getTokenToSendJSON(){
        if(this.isLoggedIn()){
            return {"token" : window.localStorage.getItem('jwt')};
        }else{
            return [];
        }
    },
    getTokenToSendData(data){
        if(this.isLoggedIn()){
            let packetToReturn = data;
            packetToReturn["token"] = window.localStorage.getItem('jwt')
            return JSON.stringify(packetToReturn);
        }else{
            return JSON.stringify([]);
        }
    },
    logout(){
        window.localStorage.removeItem('jwt');
    }
}
