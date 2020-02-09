const http    = require('http');
const fs      = require('fs');
const uuidv1  = require('uuid/v1');
const path    = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//let app = express();
const PORT = 53134;

/*

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  console.log("Received GET request");
  
});

app.listen(PORT);

console.log("Starting Server on Port " + port);
console.log("UUID " + uuidv1()); 

*/

//Takes request and response
//These are Node.js events (of http.Server)
//Called at every http request to the server
const requestListener = function (req, res) {

  let responseCode = 404;
  let content = '404 Error';

  if (req.url === '/') {
	  responseCode = 200;
    content = fs.readFileSync('./forHTML.html');
  } 
  //write headers to response stream
  res.writeHead(responseCode, {
	'content-type': 'text/html;charset=utf-8',
  });
  res.write(content);

  res.end();
}

const server = http.createServer(requestListener)
server.listen(PORT);
    
//`https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg`
