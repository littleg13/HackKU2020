import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

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

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});

app.post('/api/v1/todos', (req, res) => {
    if(!req.body.title) {
        return res.status(400).send({
        success: 'false',
        message: 'title is required'
        });
    } else if(!req.body.description) {
        return res.status(400).send({
        success: 'false',
        message: 'description is required'
        });
    }
    const todo = {
        id: db.length + 1,
        title: req.body.title,
        description: req.body.description
    }
    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        todo
    })
});

app.get('/api/v1/todos/:id', (req, res) => {
    let response;
    const id = parseInt(req.params.id, 10);
    db.map((todo) => {
        if (todo.id === id) {
            response = res.status(200).send({
                success: 'true',
                message: 'todo retrieved successfully',
                todo,
            });
        } 
    });
    if (response == null) {
        return res.status(404).send({
            success: 'false',
            message: 'todo does not exist',
        });
    } else {
        return response;
    }
});


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
  
});

app.get('/api/v1/balance:id', (req, res) => {
  
});

app.get('/api/v1/transactionHistory:id', (req, res) => {
  
});

app.post('/api/v1/deleteWallet:id', (req, res) => {
  
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

// const { XpringClient, Wallet } = require("xpring-js");

// secret = 'snS22xJCkEmy4hPoGgcq2u3uHRgvp';
// let wallet = Wallet.generateWalletFromSeed(secret)
// async function getBalance(){
//     url = 'grpc.xpring.tech:80';
//     let client = new XpringClient(url);
//     // const result = client.send(amount, dstAddr, wallet);
//     // console.log(result);
//     const balance = await client.getBalance(wallet.getAddress());
//     console.log(balance);
// }



// amount = 10;

// dstAddr = 'X7u4MQVhU2YxS4P9fWzQjnNuDRUkP3GM6kiVjTjcQgUU3Jr';

// getBalance();
// result = client.send(amount, dstAddr, address)

// print(client.get_fee())
