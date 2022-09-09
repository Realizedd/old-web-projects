var express = require('express');
var path = require('path');
var body_parser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, './static')));
app.use(body_parser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

var server = app.listen(5000, function() {
	console.log('Listening on port 5000');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('Socket ID: ' + socket.id);

	socket.on('posting_form', function(data) {
	    socket.emit('random_number', {response: "Your lucky number emitted by thre server is " + randrange(1, 1000) + "."});
	    socket.emit('updated_message', {response: "You emitted the following information to the server: " + JSON.stringify(data.response)});
	});
});

function randrange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}