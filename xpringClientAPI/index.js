import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;
const remoteURL = "grpc.xpring.tech:80"

var mysql = require('mysql');
// -------- DEV --------
var con = mysql.createConnection({
    host: "localhost",
    database: "mooxter",
    user: "root",
    password: ""
});
// -------- PROD --------
// var con = mysql.createConnection({
//     host: "mysql",
//     database: "",
//     user: "root",
//     password: "password"
// });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database");
});

// con.query("sql", function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
// });

const { XpringClient, Wallet } = require("xpring-js");
let client = new XpringClient(remoteURL);

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/newWallet/:id', (req, res) => {
    let response;
    let query = `SELECT wallet_secret FROM users WHERE uid = '${req.params.id}'`;

    try {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                response = res.status(400).send({
                    success: 'false',
                    message: `Invalid ID given`
                });
                return;
            } else if (result[0].wallet_secret != null) {
                response = res.status(400).send({
                    success: 'false',
                    message: `ID already has a wallet`
                });
                return;
            } else {
                createWallet(res, req);
            }
        });
    } catch (err) {
        response = res.status(500).send({
            success: 'false',
            message: `Failed to check for pre-existing wallet, error: ${err}`
        });
    }
});

app.post('/api/v1/send', (req, res) => {
    if (!('sUID' in req.body) || !('dUID' in req.body) || !('amount' in req.body)) {
        return res.status(400).send({
            success: 'false',
            message: `Incorrect parameters passed`
        });
    }

    let destUID = req.body.dUID;
    let destWalletAdd;

    let query = `SELECT wallet_address FROM users WHERE uid = '${destUID}'`;
   
    try {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result.length != 1) {
                res.status(400).send({
                    success: 'false',
                    message: `Dest uid does not exist`
                });
                return;
            } else {
                destWalletAdd = result[0].wallet_address;
                getSendingWallet(res, req, destWalletAdd);
            }
        });
    } catch (err) {
        response = res.status(500).send({
            success: 'false',
            message: `Failed to get dest wallet address, error: ${err}`
        });
        return;
    }
});

app.get('/api/v1/balance/:id', (req, res) => {
    let query = `SELECT wallet_address FROM users WHERE uid = '${req.params.id}'`;

    try {
        con.query(query, async function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                response = res.status(400).send({
                    success: 'false',
                    message: `Invalid ID given`
                });
                return;
            }
            const address = result[0].wallet_address;
            
            const balance = await client.getBalance(address).catch((error) => {
                if (error.details == "Account not found.") {
                    return 0;
                } else {
                    console.log(error);
                }
            });

            return res.status(200).send({
                success: 'true',
                balance,
            });
        });
    } catch (err) {
        response = res.status(500).send({
            success: 'false',
            message: `Failed to check for pre-existing wallet, error: ${err}`
        });
    }
});

app.get('/api/v1/transactionHistory/:id', (req, res) => {
    let userID = req.params.id;
    let query = `SELECT toID, fromID, amount, hash FROM transactions WHERE toID='${userID}' or fromID='${userID}'`;

    try {
        con.query(query, function (err, result) {
            if (err) throw err;
            result = result.map(v => Object.assign({}, v));
            if (result.length == 0) {
                return res.status(200).send({
                    success: 'false',
                    message: `No transactions found.`
                });
            } else {
                return res.status(200).send({
                    success: 'true',
                    result
                });
            }
        });
    } catch (err) {
        response = res.status(400).send({
            success: 'false',
            message: `Error when fetching transactions, error: ${err}`
        });
        return;
    }
});

app.post('/api/v1/deleteWallet/:id', (req, res) => {
  let query = `UPDATE users SET discord_uid='DELETED' WHERE uid='${req.params.id}'`;

  try {
    con.query(query, function (err, result) {
        if (err) throw err;
        response = res.status(200).send();
    });
  } catch (err) {
    response = res.status(500).send({
        success: 'false',
        message: `Failed to get dest wallet address, error: ${err}`
    });
    return;
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

function createWallet(res, req) {
    const newWallet = Wallet.generateRandomWallet().wallet;

    query = `UPDATE users SET wallet_address = '${newWallet.getAddress()}', wallet_secret = '${newWallet.getPrivateKey()}', \
                wallet_public = '${newWallet.getPublicKey()}' WHERE uid = '${req.params.id}'`;
    
    try {
        con.query(query, function (err, result) {
            if (err) throw err;
            res.status(200).send({
                success: 'true',
                message: 'Wallet created successfully',
            });
        });
    } catch (err) {
        return res.status(400).send({
            success: 'false',
            message: `Failed to create wallet, error: ${err}`
        });
    }
}

async function getSendingWallet(res, req, destWalletAdd) {
    let sendingUID = req.body.sUID;
    let amount = BigInt(req.body.amount * Math.pow(10, 6));

    let query = `SELECT wallet_secret, wallet_public FROM users WHERE uid = '${sendingUID}'`;

    try {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result.length != 1) {
                return res.status(400).send({
                    success: 'false',
                    message: `Sending uid does not exist`
                });
            } else {
                let sendingWalletPrivAdd = result[0].wallet_secret;
                let sendingWalletPubAdd = result[0].wallet_public;
                let sendingWallet = new Wallet(sendingWalletPubAdd, sendingWalletPrivAdd);
                finishSending(res, req, amount, destWalletAdd, sendingWallet);
            }
        });
    } catch (err) {
        response = res.status(500).send({
            success: 'false',
            message: `Failed to get dest wallet address, error: ${err}`
        });
        return;
    }
}

async function finishSending(res, req, amount, destWalletAdd, sendingWallet) {
    const transactionHash = await client.send(amount, destWalletAdd, sendingWallet);
    let query = `INSERT INTO transactions (toID, fromID, amount, hash) VALUES ('${req.body.dUID}', '${req.body.sUID}', '${amount}', '${transactionHash}')`;

    con.query(query, function (err, result) {
        if (err) console.log(err);
    });

    return res.status(200).send({
        success: 'true',
        transactionHash,
    });
}