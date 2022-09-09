var express = require('express');
var path = require('path');
var body_parser = require('body-parser');
var session = require('express-session');

var app = express();

app.use(express.static(path.join(__dirname, './static')));
app.use(body_parser.urlencoded({extended: true}));
app.use(session({secret: '6c1fea37-1df9-4c33-b53a-dd1d31ad88fc', resave: false, saveUninitialized: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var users = {};

function find_by_sid(sid) {
	for (name in users) {
		if (users[name] == sid) {
			return name;
		}
	}

	return false;
}

var messages = [];

app.get('/', function(request, response) {
	var verified = !find_by_sid(request.sessionID);
	response.render('index', {verified: !verified, messages: messages});
});

app.post('/verify', function(request, response) {
	var name = request.body.name;
	var sid = request.sessionID;
	var data = {
		verified: false
	};

	if (name) {
		if (!users[name]) {
			users[name] = sid;
			data.verified = true;
		} else if (users[name] == sid) {
			data.verified = true;
		}
	}

	response.send(data);
	console.log('Name: ' + name + ' SID: ' + sid + ' Verified: ' + data.verified);
});

var server = app.listen(5000, function() {
	console.log('Listening on port 5000');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('A user connected with the following Socket ID: ' + socket.id);

	socket.on('post_message', function(data) {
		var array = socket.handshake.headers.cookie.split('s%3A');
		var sessionID = array[array.length - 1].split('.')[0];
		var name = find_by_sid(sessionID);

		if (name) {
			io.emit('new_message', {name: name, message: data.message});
			messages.push(name + ": " + data.message);
		}
	});
});