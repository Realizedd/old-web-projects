// require statements
var express 	= require('express'),
	path		= require('path');

var app = express();

// app settings
app.use(express.static(path.join(__dirname, './client')));

// more require statements

var server = app.listen(5000, function() {
	console.log('[mean_project] Listening on port 5000');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('New connection with id: ' + socket.id);


});