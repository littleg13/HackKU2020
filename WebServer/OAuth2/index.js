const http = require('http');
const fs   = require('fs');
const uuidv1 = require('uuid/v1');
const port = 53134;

console.log("Starting Server on Port " + port);
console.log("UUID " + uuidv1()); 

//Takes request and response
//These are Node.js events (of http.Server)
//Called at every http request to the server
const requestListener = function (request, response) {

    let responseCode = 404;
    let content = '404 Error';
    
    if (request.url === '/') {
		responseCode = 200;
		content = fs.readFileSync('./indexReturn.html');
	}

    //write headers to response stream
    response.writeHead(responseCode, {
		'content-type': 'text/html;charset=utf-8',
    });
    response.write(content);
	response.end();
}

const server = http.createServer(requestListener)
server.listen(port);
    
