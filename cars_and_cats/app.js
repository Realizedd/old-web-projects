var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request, response) {
	console.log('Client requested URL: ' + request.url);

	if (request.url == '/cars') {
		fs.readFile('./views/cars.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else if (request.url == '/cats') {
		fs.readFile('./views/cats.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else if (request.url == '/cars/new') {
		fs.readFile('./views/new.html', 'utf8', function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(contents);
			response.end();
		});
	} else if (request.url.startsWith('/images/') && request.url.split('/') == 3) {
		var content = request.url.split('/');
		
		fs.readFile('./images/' + content[2], function(errors, contents) {
			response.writeHead(200, {'Content-Type': 'image/*'});
			response.write(contents);
			response.end();
		});
	} else {
		response.writeHead(404);
		response.end('Unknown root.');
	}
});

server.listen(7077);
console.log('(localhost) Server listening on port 7077');