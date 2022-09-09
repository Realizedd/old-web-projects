// require statements
var express 	= require('express'),
	path		= require('path');

var app = express();

// app settings
app.use(express.static(path.join(__dirname, './client')));

// more require statements

var server = app.listen(5000, function() {
	console.log('[cloud_game] Listening on port 5000');
});

var players = {};

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('A user connected with the following Socket ID: ' + socket.id);

	socket.on('join', function(data) {
		socket.emit('players', players);
		players[socket.id] = {name: data.name, x: data.x, y: data.y, id: socket.id, radius: data.radius};
		socket.broadcast.emit('join', players[socket.id]);
	});

	socket.on('move', function(data) {
		players[socket.id].x = data.x;
		players[socket.id].y = data.y;
		players[socket.id].radius = data.radius;
		socket.broadcast.emit('move', {id: socket.id, x: data.x, y: data.y, radius: data.radius});
	});

	socket.on('disconnect', function() {
		io.emit('quit', {id: socket.id});
		console.log('Socket ID ' + socket.id + " disconnected.");
		delete players[socket.id]
	});
});