var express = require('express')
var mysql = require('mysql')
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express()
var Jimp = require('jimp');

let jwt = require('jsonwebtoken');
let fetch = require('fetch').fetchUrl;

app.use(cors());
// parse application/json
app.use(bodyParser.json());

app.use(express.static('C:/Users/Matthew/Documents/NDN Summer Server/overviewer-output'));

let isDBConnected = false;

var con = mysql.createConnection({
    host: "localhost",
    user: "website",
    password: "imthemcwebsite",
    database: "minecraft-data"
});

con.connect(function (err) {
    if (err) throw err;
    isDBConnected = true;
});

app.get('/', function (req, res) {
    if (isDBConnected) {
        res.send('Server running and connected to SQL DB')
    } else {
        res.send('Server not connected to SQL DB')
    }
})

app.get('/players', function (req, res) {
    if (isDBConnected) {
        con.query('SELECT * from players', function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    }
})

app.post('/checkVerifyStatus', function (req, res) {
    if (isDBConnected) {
        console.log(req.body);
        con.query('SELECT (isverified) from players WHERE username = ?', [req.body.username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                if (results[0].isverified) {
                    res.json({ message: "good" });
                } else {
                    res.json({ message: "bad" });
                }
            } else {
                res.json({ message: "Please login to the Minecraft Server before trying to make your account." });
            }
        });
    }
})

app.post('/verify', function (req, res) {
    if (isDBConnected) {
        console.log(req.body);
        con.query('SELECT (verificationcode) from players WHERE username = ?', [req.body.username], function (error, results, fields) {
            if (error) throw error;
            if (req.body.code == results[0].verificationcode) {
                con.query('UPDATE players SET hashword = ?, isverified = ? WHERE username = ?', [req.body.hashword, 1, req.body.username], function (error, results, fields) {
                    if (error) throw error;
                    res.json({ "message": "good" });
                });
            } else {
                res.json({ "message": "Incorrect Code" });
            }
        });
    }
})

app.post('/login', function (req, res) {
    if (isDBConnected) {
        con.query('SELECT * from players WHERE username = ?', [req.body.username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                if (results[0].hashword == req.body.hashword) {
                    var token = jwt.sign({ username: req.body.username }, 'superdupersecret');
                    res.json({ "message": "good", "token": token });
                } else {
                    res.json({ "message": "bad" });
                }
            }
        });
    }
})

app.post('/transactions', function (req, res) {
    if (isDBConnected) {
        console.log(jwt.decode(req.body.token));
        let username = jwt.decode(req.body.token).username;
        con.query('SELECT * from players WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                con.query('SELECT * from transactions WHERE sender = ? OR reciever = ? ORDER BY `time` ASC', [results[0].accountid, results[0].accountid], function (error, results, fields) {
                    if (error) { console.log(error); throw error; }
                    if (results.length > 0) {
                        res.json(results);
                    } else {
                        res.json([]);
                    }
                });
            }
        });

    } else {
        res.json({ message: "bad" });
    }
})

// app.post('/requestUpdateImageCache', function (req, res) {
//     let username = req.body.username;
//     if(tryUpdateImageForUsername(username)){
//         res.json({"message" : "good"});
//     }else{
//         res.json({"message" : "bad"});
//     }
// })

// function tryUpdateImageForUsername(username){
//     fetch("https://api.minetools.eu/uuid/" + username, {
//         method: "POST", mode: "cors"
//     }).then(response => response.json()).catch(reason => console.log(reason))
//         .then((data) => {
//             let id = data.id;
//             fetch("https://api.minetools.eu/profile/" + id, {
//                 method: "GET"
//             }).then(response => response.json()).catch(reason => console.log(reason))
//                 .then((data) => {
//                     fetch(data.decoded.textures["SKIN"].url + "", {
//                         method: "GET", mode: "no-cors"
//                     })
//                         .then(response => {
//                             Jimp.read(response.blob())
//                                 .then(image => {
//                                     console.log(image)
//                                 })
//                                 .catch(err => {
//                                     console.log(err);
//                                 });
//                         })


//                 });
//         });
// }

app.listen(8081)