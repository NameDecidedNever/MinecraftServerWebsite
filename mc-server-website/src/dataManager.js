import TokenManager from './tokenManager';
export default {
    getDataFromEndpoint(endpoint){
        return new Promise((resolve, reject) => {
            fetch("http://" + window.location.hostname + ':8081/' + endpoint, {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: TokenManager.getTokenToSend().toString()
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