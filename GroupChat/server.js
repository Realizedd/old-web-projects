var express = require('express'),
	path	= require('path');

var app = express();

app.use(express.static(path.join(__dirname, './views')));

app.get('/', function(req, res) {
	res.render('index');
});

var server = app.listen(5000, function() {
	console.log('GroupChat now running on port 5000!');
});

var io = require('socket.io').listen(server);

var chatters = {};
var messages = [];

io.sockets.on('connection', function (socket) {
	console.log(socket.id + " connected.");

	socket.on('username', function(data) {
		chatters[socket.id] = data.username;
		console.log(socket.id + "'s username is " + data.username);
		socket.emit('previous_messages', {messages: messages});
	});

	socket.on('message', function(data) {
		if (chatters[socket.id]) {
			console.log('Received a message from ' + chatters[socket.id] + ": " + data.message);
			var message = chatters[socket.id] + ": " + data.message;
			messages.push(message);
			socket.broadcast.emit('message', {message: message});
		}
	});
});
