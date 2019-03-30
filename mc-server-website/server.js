var express = require('express')
var mysql = require('mysql')
var cors = require('cors');
var app = express()

app.use(cors());

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

app.listen(8081)