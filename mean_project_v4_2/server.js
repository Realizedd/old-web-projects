var express 	= require('express'),
	path		= require('path'),
	dateFormat	= require('dateformat'),
	sanitize 	= require('sanitize-html'),
	util 		= require('./util');

var app = express();

app.use(express.static(path.join(__dirname, './client')));

var server = app.listen(5000, function() {
	console.log('[mean_project_v3] Listening on port 5000');
});

var io = require('socket.io').listen(server);

var Game = {};

(function() {
	function Player(x, y, maxWidth, maxHeight) {
		this.x = x;
		this.y = y;
		this.score = 0;
		this.maxWidth = maxWidth;
		this.maxHeight = maxHeight;
	}

	Player.prototype.move = function(key) {
		switch (key) {
			case 37:
				if (this.x - 2.5 >= 0) {
					this.x -= 5;
				}

				break;
			case 39:
				if (this.x + 60 < this.maxWidth) {
					this.x += 5;
				}
		}
	};
 
	Player.prototype.clone = function(id) {
		var _clone = new Player(this.x, this.y, this.maxWidth, this.maxHeight);
		_clone.score = this.score;
		
		if (this.name) {
			_clone.name = this.name;
		}

		_clone.id = id;
		return _clone;
	}

	Game.Player = Player;
})();

(function() {
	function Hoop(start, end) {
		this.start = start;
		this.end = end;
	}

	Hoop.prototype.is_score = function(ball) {
		var xrange = (ball.x > this.start.x && ball.x < this.end.x);
		var yrange = (ball.y > this.end.y) && util.diff(ball.y, this.end.y) <= 17.0;

		if (ball.fall_distance != 0.0 && xrange && yrange && !ball.goaled) {
			ball.player.score++;
			ball.goaled = true;
			return;
		}

		if (ball.goaled != undefined || ball.fall_distance == 0.0) {
			return;
		}

		var bounce_front = ((ball.x < this.start.x && util.diff(ball.x, this.start.x) <= 15.0) && util.diff(ball.y, this.start.y) <= 17.0);
		var bounce_end = (ball.x >= this.end.x && util.diff(ball.x, this.end.x) <= 100.0 && util.diff(ball.y, this.start.y) <= 17.0);
		var bounce_wall = (util.diff(ball.x, 502.0) <= 17.0 && util.diff(ball.y, 152.0) <= 15.0);
		
		if (bounce_front || bounce_end || bounce_wall) {
			console.log(bounce_front, bounce_end, bounce_wall);
			ball.goaled = false;
			ball.bounce_reason = 'hit';
			ball.fall_distance = 0.0;
			ball.fall_speed = 0.56;
			ball.velocity = {x: -3, y: 5};
			return;
		}
	};

	Game.Hoop = Hoop;
})();

(function() {
	function Ball(player, x, y, xv, yv) {
		this.x = x;
		this.y = y;
		this.player = player;

		// Default settings
		this.fall_distance = 0.0;
    	this.fall_speed = 0.1;
    	this.bounce_power = 8;
    	this.bounce_reason = 'fall';
    	this.velocity = {x: xv, y: yv};
    	this.thrower_loc = {x: x, y: y};
    	this.creation = new Date().getTime();
	}

	Game.Ball = Ball;
})();

var hoop = new Game.Hoop({x: 440, y: 207}, {x: 470, y: 207});
var players = {};
var controllers = {};
var balls = [];

var arena_settings = {
	height: 400,
	width: 800,
};

Game.main = function() {
	for (var i = 0; i < balls.length; i++) {
		var curr = balls[i];

		if (new Date().getTime() - curr.creation >= 10000) {
			balls.splice(i, 1);
			i--;
			continue;
		}

        if (curr.velocity.y > 0.0) {
        	curr.y -= (curr.velocity.y -= 0.5);
        } else {
        	curr.y += (curr.fall_distance += curr.fall_speed);
        }

        if (Math.abs(curr.velocity.x) > 0.1) {
    		curr.x += (curr.velocity.x > 0 ? (curr.velocity.x -= 0.03) : (curr.velocity.x += 0.03));
        }

        if (curr.y >= 380.0) {
        	curr.y = 380.0;
       		curr.fall_distance = 0.0;

       		if (curr.bounce_power > 0) {
      			if (curr.bounce_power == 8) {
      				curr.velocity.x = curr.bounce_reason == 'fall' ? 5 : -5;
      			}

       			curr.velocity.y = (curr.bounce_power -= 1);
       		}
        } else {
        	hoop.is_score(curr);
        }
	}

	for (var id in players) {
		if (io.sockets.connected[id]) {
			io.sockets.connected[id].emit('update', {self: players[id], players: util.values(players, id), balls: util.filter(balls, players[id])});
		}
	}
}

setInterval(Game.main, 1000 / 60);

io.sockets.on('connection', function(socket) {
	if (!socket.handshake.headers['user-agent'].includes('Controller')) {
		console.log('>>> A Player connected with id - ' + socket.id);
		players[socket.id] = new Game.Player(0, 300, 400, 400);
		players[socket.id].secret_key = util.randrange(10000, 99999);
		socket.emit('code', {code: players[socket.id].secret_key});
	} else {
		console.log('>>> A Controller connected with id - ' + socket.id);
	}

	socket.on('login', function(data) {
		if (!data.name) {
			socket.emit('login_response', {error: 'Please type a valid name.'});
			return;
		}

		players[socket.id].name = data.name;
		socket.emit('login_response', {success: true});
	});

	socket.on('join', function(data) {
		if (players[socket.id].name) {
			socket.emit('join_response', arena_settings);
			io.emit('message', {name: 'SERVER', message: '<span style="color: #31b0d5;">' + players[socket.id].name + ' joined the game.</span>', creation: dateFormat(new Date(), "h:MM:ss TT")});
		} else {
			socket.emit('join_response', {error: 'You must have a valid name to join.'});
			socket.disconnect();
			delete players[socket.id];
		}
	});

	socket.on('move', function(data) {
		if (players[socket.id]) {
			players[socket.id].move(data.keyCode);
		}
	});

	socket.on('controller', function(data) {
		for (id in players) {
			var player = players[id];

			if (io.sockets.connected[id] && player.secret_key && data.secret_key == player.secret_key) {
				controllers[socket.id] = id;
				socket.emit('controller_response', {code: 0})
				return;
			}
		}

		socket.emit('controller_response', {code: -1})
	});

	socket.on('throw', function(data) {
		var player = players[socket.id];

		if (player) {
			var ball = new Game.Ball(player, player.x + 30.0, player.y, data.time_held / 1000, data.time_held / 300);
			var distance = util.dist(player.x, player.y, 400, 140);
			ball.velocity.x += distance / 250;
			ball.velocity.y += distance / 500;
			console.log(ball.velocity.x, ball.velocity.y);
			balls.push(ball);
			return;
		}

		var id = controllers[socket.id];

		if (id && io.sockets.connected[id]) {
			var player = players[id];

			if (player.name) {
				var ball = new Game.Ball(player, player.x + 30.0, player.y, data.x * 4.45, data.y * 1.4);
				var distance = util.dist(player.x, player.y, 400, 140);
				ball.velocity.x += distance / 250;
				ball.velocity.y += distance / 500;
				ball.player = player;
				console.log(ball.velocity.x, ball.velocity.y);
				balls.push(ball);
				io.sockets.connected[id].emit('controller_throw', {ball: ball});
			}
		}
	});

	// TODO: Add if (player.name) check for every listen to prevent no-name users

	socket.on('message', function(data) {
		if (data.message) {
			data.message = sanitize(data.message);
			console.log('>>> Received a message: ' + JSON.stringify(data));
			io.emit('message', {name: players[socket.id].name, message: data.message, creation: dateFormat(new Date(), "h:MM:ss TT")});
		}
	});

	socket.on('disconnect', function() {
		console.log('>>> ' + socket.id + ' disconnected.');

		if (players[socket.id]) {
			io.emit('message', {name: 'SERVER', message: '<span style="color: #31b0d5;">' + players[socket.id].name + ' left the game.</span>', creation: dateFormat(new Date(), "h:MM:ss TT")});
			delete players[socket.id];

			for (var id in controllers) {
				if (controllers[id] == socket.id && io.sockets.connected[id]) {
					io.sockets.connected[id].disconnect();
					delete controllers[id]
				}
			}
		} else {
			var id = controllers[socket.id];

			if (id && io.sockets.connected[id]) {
				io.sockets.connected[id].emit('message', {name: 'SERVER', message: '<span style="color: #d9534f; font-weight: bold;"> You no longer have a controller connected.</span>', creation: dateFormat(new Date(), "h:MM:ss TT")})
			}

			delete controllers[socket.id];
		}
	});
});