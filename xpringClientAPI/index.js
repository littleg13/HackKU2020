import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

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

app.get('/api/v1/newWallet', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

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
