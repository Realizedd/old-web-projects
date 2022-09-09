var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request, response) {
	// console.log('Client requested from: ' + request.url);

	if (request.url == '/') {
		fs.readFile('index.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else if (request.url == '/ninjas') {
		fs.readFile('ninjas.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else if (request.url == '/dojos/new') {
		fs.readFile('new.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else {
		fs.readFile('errors.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	}
});

server.listen(5000);
console.log('(localhost) Server listening on port 5000');