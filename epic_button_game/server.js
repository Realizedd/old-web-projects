var express = require('express');
var path = require('path');
var body_parser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, './static')));
app.use(body_parser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var counter = 0;

app.get('/', function(request, response) {
	response.render('index', {counter: counter});
});

var server = app.listen(5000, function() {
	console.log('Listening on port 5000');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('A user connected with ID: ' + socket.id);

	socket.on('increase', function(data) {
		counter++;
		console.log('Counter updated: ' + counter);
		io.emit('update_counter');
	});

	socket.on('reset', function(data) {
		counter = 0;
		console.log('Counter updated: ' + counter);
		io.emit('reset_counter');
	});
});