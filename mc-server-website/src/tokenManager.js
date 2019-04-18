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
    logout(){
        window.localStorage.removeItem('jwt');
    }
}
