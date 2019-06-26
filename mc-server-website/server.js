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

app.post('/players', function (req, res) {
    if (isDBConnected) {
        con.query('SELECT * from players', function (error, players, fields) {
            if (error) throw error;
            let playersList = players;
            con.query('SELECT * from accounts', function (error, accounts, fields) {
                if (error) throw error;
                con.query('SELECT * from plots', function (error, plots, fields) {
                    if (error) throw error;
                    con.query('SELECT * from towns', [], function (error, towns, fields) {
                        if (error) throw error;
                playersList.forEach((playerWhoNeedsAccountData) => {
                    accountId = playerWhoNeedsAccountData.accountid;
                    accounts.forEach((accountOfPlayer) => {
                        if(accountOfPlayer.idaccounts == accountId){
                            playerWhoNeedsAccountData.balance = accountOfPlayer.balance;
                        }
                    });
                    plots.forEach((potentialPlayerPlot) => {
                        if(potentialPlayerPlot.renterid == playerWhoNeedsAccountData.idplayers){
                            let townId = potentialPlayerPlot.townid;
                            let townName = "";
                            towns.forEach((town) => {
                                if(town.idtowns == townId){
                                    townName = town.name;
                                }
                            });
                                playerWhoNeedsAccountData.townName = townName;
                        }
                    });
                });
                //console.log(playersList);
                res.json(playersList);
            });
        });
        });
    });
    }else{
    res.json({message:"bad"});
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

app.post('/towns', function (req, res) {
    if (isDBConnected) {
        con.query('SELECT * from towns', [], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.json(results);
            } else {
                res.json([]);
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})



app.post('/constants', function (req, res) {
    if (isDBConnected) {
        console.log(req.body);
        console.log(jwt.decode(req.body.token));
        con.query('SELECT * from constants', [], function (error, results, fields) {
            if (error) throw error;
            res.json(results);
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/transactions', function (req, res) {
    if (isDBConnected) {
        console.log(req.body);
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

app.post('/expenses', function (req, res) {
    if (isDBConnected) {
        console.log(jwt.decode(req.body.token));
        let username = jwt.decode(req.body.token).username;
        con.query('SELECT * from players WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                con.query('SELECT * from expenses WHERE sender = ?', [results[0].accountid, results[0].accountid], function (error, results, fields) {
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

app.post('/updateTownTaxes', function (req, res) {
    if (isDBConnected) {
        let town = req.body.town;
        con.query('UPDATE towns SET mobKillTaxPerc = ?, chestShopTaxPerc = ?, warpTaxPerc = ? WHERE idtowns = ?', [town.mobKillTaxPerc, town.chestShopTaxPerc, town.warpTaxPerc, town.idtowns], function (error, results, fields) {
            if (error) { console.log(error); throw error; }
            if (results.length > 0) {
                res.json(results);
            } else {
                res.json([]);
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/towndetails', function (req, res) {
    if (isDBConnected) {
        let townName = req.body.townName;
        con.query('SELECT * from towns WHERE name = ?', [townName], function (error, results, fields) {
            if (error) { console.log(error); throw error; }
            if (results.length > 0) {
                res.json(results);
            } else {
                res.json([]);
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/setResidentsCanEditTown', function (req, res) {
    if (isDBConnected) {
        let townName = req.body.townName;
        let value = req.body.allowResidentsToEditTown;
        con.query('UPDATE towns SET allowResidentsToEditTown = ? WHERE name = ?', [value ? 1 : 0, townName], function (error, results, fields) {
            if (error) { console.log(error); throw error; }
                res.json([]);
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/plots', function (req, res) {
    if (isDBConnected) {
        let townName = req.body.townName;
        con.query('SELECT * from towns WHERE name = ?', [townName], function (error, results, fields) {
            if (error) { console.log(error); throw error; }
            if (results.length > 0) {
                let townId = results[0]["idtowns"];
                con.query('SELECT * from plots WHERE townid = ?', [townId], function (error, results, fields) {
                    if (error) { console.log(error); throw error; }
                    res.json(results);
                });
            } else {
                res.json([]);
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/updatemotd', function (req, res) {
    if (isDBConnected) {
        let town = req.body.town;
        con.query('UPDATE towns SET motd = ? WHERE idtowns = ?', [town.motd, town.idtowns], function (error, results, fields) {
            if (error) { 
                console.log(error); res.json({message : "bad"})
            }else{
                res.json({message : "good"});
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/buyplot', function (req, res) {
    if (isDBConnected) {
        let plotid = req.body.plotid;
        let usernameOfBuyer = jwt.decode(req.body.token).username;
        con.query('SELECT * from players WHERE username = ?', [usernameOfBuyer], function (error, results1, fields) {
            if (error) { console.log(error); throw error; }
            if (results1.length > 0) {
                let playerid = results1[0].idplayers;
                let playerAccountId = results1[0].accountid;
                con.query('SELECT * FROM plots WHERE idplots = ?', [plotid], function (error, results2, fields) {
                    if (error) { console.log(error); throw error; }
                    //console.log(results2);
                    let townId = results2[0].townid;
                    if(results2[0].renterid != null){
                        res.json({ message: "bad" });
                        return;
                    }
                con.query('UPDATE plots SET renterid = ? WHERE idplots = ?', [playerid, plotid], function (error, results3, fields) {
                    if (error) { console.log(error); throw error; }
                    con.query('SELECT * from towns WHERE idtowns = ?', [townId], function (error, results4, fields) {
                        if (error) { console.log(error); throw error; }
                        townOwnerAccountId = results4[0].ownerAccountId;
                        con.query('INSERT INTO expenses (sender, reciever, amount, message) VALUES (?, ?, ?, ?)', [playerAccountId, townOwnerAccountId, results2[0].pricePerDay, "Plot Rental For " + results2[0].name], function (error, results5, fields) {
                            if (error) { console.log(error); throw error; }
                            let expenseID = results5.insertId;
                            con.query('INSERT INTO pendingexpenses (sender, reciever, amount, message, expenseid) VALUES (?, ?, ?, ?, ?)', [playerAccountId, townOwnerAccountId, results2[0].pricePerDay, "Plot Rental For " + results2[0].name, expenseID], function (error, results6, fields) {
                                if (error) { console.log(error); throw error; }
                            con.query('UPDATE plots SET expenseid = ? WHERE idplots = ?', [expenseID, plotid], function (error, results3, fields) {
                                if (error) { console.log(error); throw error; }
                            res.json({ message: "good" });
                            });
                        });
                        });
                });
            });
        });
            } else {
                res.json({ message: "good" });
            }
        });
    } else {
        res.json({ message: "bad" });
    }
})

app.post('/deleteplot', function (req, res) {
    if (isDBConnected) {
        let plotid = req.body.plotid;
                con.query('DELETE FROM plots WHERE idplots = ?', [plotid], function (error, results, fields) {
                    if (error) { console.log(error); throw error; }
                    res.json({ message: "good" });
            });
            } else {
                res.json({ message: "bad" });
            }
})

app.post('/evict', function (req, res) {
    if (isDBConnected) {
        let plotid = req.body.plotid;
        let isEviction = req.body.isEviction;
                con.query('SELECT * FROM plots WHERE idplots = ?', [plotid], function (error, results2, fields) {
                    if (error) { console.log(error); throw error; }
                    let expenseID = results2[0].expenseid;
                    if(results2[0].renterid == null){
                        res.json({ message: "bad" });
                        return;
                    }
                con.query('UPDATE plots SET renterid = ? WHERE idplots = ?', [null, plotid], function (error, results3, fields) {
                    if (error) { console.log(error); throw error; }
                        con.query('DELETE FROM expenses WHERE idexpenses = ?', [expenseID], function (error, results5, fields) {
                            if (error) { console.log(error); throw error; }
                            con.query('DELETE FROM plotpermissionsmap WHERE plotid = ?', [plotid], function (error, results7, fields) {
                                if (error) { console.log(error); throw error; }
                            if(isEviction){
                                con.query('DELETE FROM pendingexpenses WHERE expenseid = ?', [expenseID], function (error, results6, fields) {
                                    if (error) { console.log(error); throw error; }
                                        res.json({ message: "good" });
                                });
                            }else{
                            res.json({ message: "good" });
                            }
                        });
                    });
            });
        });
            } else {
                res.json({ message: "bad" });
            }
})

app.post('/about', function (req, res) {
    if (isDBConnected) {
        con.query('SELECT * from `about`', [], function (error, results, fields) {
            if (error) { console.log(error); throw error; }
            if (results.length > 0) {
                con.query('SELECT COUNT(*) from `transactions`', [], function (error, transactionCount, fields) {
                    if (error) { console.log(error); throw error; }
                    results[0].transactionsFufilled = transactionCount[0]['COUNT(*)'];
                    con.query('SELECT balance from `accounts` WHERE name = ?', ['server'], function (error, serverBalance, fields) {
                        if (error) { console.log(error); throw error; }
                        results[0].serverBankAccount = serverBalance[0]['balance'];
                        res.json(results);
                    });
                });

            } else {
                res.json([]);
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