var express = require('express')
var mysql = require('mysql')
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express()

let jwt = require('jsonwebtoken');
const config = require('../config.js');

app.use(cors());
// parse application/json
app.use(bodyParser.json())

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
            if(results.length > 0){
                if(results[0].isverified){
                    res.json({message : "good"});
                }else{
                    res.json({message : "bad"});
                }
            }else{
                res.json({message : "Please login to the Minecraft Server before trying to make your account."});
            }
        });
    }
})

app.post('/verify', function (req, res) {
    if (isDBConnected) {
        console.log(req.body);
        con.query('SELECT (verificationcode) from players WHERE username = ?', [req.body.username], function (error, results, fields) {
            if (error) throw error;
            if(req.body.code == results[0].verificationcode){
                con.query('UPDATE players SET hashword = ?, isverified = ? WHERE username = ?', [req.body.hashword, 1, req.body.username], function (error, results, fields) {
                    if (error) throw error;
                    res.json({"message" : "good"});
                });
            }else{
                res.json({"message" : "Incorrect Code"});
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
                }
            }
        });
    }
})

app.listen(8081)