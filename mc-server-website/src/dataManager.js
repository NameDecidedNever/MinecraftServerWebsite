import TokenManager from './tokenManager';
export default {
    getDataFromEndpoint(endpoint, extraData){
        return new Promise((resolve, reject) => {
            fetch("http://" + window.location.hostname + ':8081/' + endpoint, {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: (extraData !== undefined) ? TokenManager.getTokenToSendData(extraData) : TokenManager.getTokenToSend()
            })
                .then(response => response.json()).catch(reason => console.log(reason))
                .then((data) => {
                    resolve(data);
                }).catch(e => {
                    console.log(e);
                });
            });
    }
}