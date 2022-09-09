var Game = {};

(function() {
	function Ball(x, y, xv, yv) {
		this.x = x;
		this.y = y;

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

(function() {
	function Hoop(start, end) {
		this.start = start;
		this.end = end;
	}

	Hoop.prototype.is_score = function(ball, text) {
		var xrange = (ball.x > this.start.x && ball.x < this.end.x);
		var yrange = (ball.y > this.end.y) && util.diff(ball.y, this.end.y) <= 17.0;

		if (ball.fall_distance != 0.0 && xrange && yrange && !ball.goaled) {
			ball.goaled = true;

			if (ball.bounce_reason == 'hit') {
				text.message = 'Nice!';
			} else {
				text.message = 'Exellent!';
			}

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

var requestAnimationFrame = 
	window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var text = {
	message: '',
	size: 0,
	max_size: 110,
	counter: 0,
	max_counter: 45
}

var balls = [];
var hoop = new Game.Hoop({x: 440, y: 207}, {x: 470, y: 207});

var last_data;
var last = 0;

Game.main = function(socket) {
	for (var i = 0; i < balls.length; i++) {
		var curr = balls[i];

		if (new Date().getTime() - curr.creation >= 5000) {
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
      				if (!curr.goaled) {
      					var score_sound = new Audio('./../audio/crowdBoo.wav');
       					score_sound.play();
      				}

      				curr.velocity.x = curr.bounce_reason == 'fall' ? 5 : -5;
      			}

       			curr.velocity.y = (curr.bounce_power -= 1);
       			var bounce_sound = new Audio('./../audio/bounce.wav');
       			bounce_sound.play();
       		}
        } else {
        	hoop.is_score(curr, text);
        }
    }

	var canvas = document.getElementById('map');

	if (last_data && canvas) {
		var ctx = canvas.getContext('2d');

		var client = last_data.self;
		var image = 'still';

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		$('#scores td').parent().remove();

	    var new_html = '';

		for (var i in last_data.players) {
			var client = last_data.players[i];

			var is_self = false;

			if (client.id && client.id.substring(2) == socket.currentId()) {
				is_self = true;
			}

			ctx.beginPath();
			ctx.drawImage(document.getElementById(image), client.x, client.y);
			ctx.font = 'bold 10pt Tahoma';
	        ctx.fillStyle = is_self ? '#bebe36' : 'black';
	        ctx.textAlign = 'center';
	        ctx.fillText(is_self ? 'You' : client.name, client.x + 30, client.y + 5);
			ctx.closePath();
		}

		for (var i in util.sort(last_data.players)) {
			var client = last_data.players[i];
			var is_self = false;

			if (client.id && client.id.substring(2) == socket.currentId()) {
				is_self = true;
			}

			new_html += '<tr><td>' + (i * 1 + 1) + '</td><td>' + (is_self ? '<span style="color: #e0e093; font-weight: bold;">You</span>' : client.name) + '</td><td>' + client.score + '</td></tr>';
		}

		$('#scores').append(new_html);

		for (var i = 0; i < balls.length; i++) {
			var curr = balls[i];
			ctx.beginPath();
			ctx.arc(curr.x, curr.y, 15, 0, 2 * Math.PI);
	        ctx.fillStyle = 'red';
	        ctx.fill();
	        ctx.closePath();
		}

		for (var i = 0; i < last_data.balls.length; i++) {
			var curr = last_data.balls[i];
			ctx.beginPath();
			ctx.arc(curr.x, curr.y, 15, 0, 2 * Math.PI);
	        ctx.fillStyle = 'darkorange';
	        ctx.fill();
	        ctx.closePath();
	    }

	    ctx.beginPath();
	    ctx.drawImage(document.getElementById('hoop'), 400, 140);
	    ctx.closePath();

	    if (text.message && text.message != '') {
	    	if (text.size >= text.max_size) {
		    	if (text.counter >= text.max_counter) {
		    		text.message = '';
		    		text.counter = 0;
		    		text.size = 0;
		    	} else {
		    		text.counter++;
		    		ctx.beginPath();
				    ctx.font = 'bold ' + text.size + 'pt Tahoma';
				    ctx.fillStyle = 'white';
				    ctx.textAlign = 'center';
				    ctx.fillText(text.message, canvas.width / 2, canvas.height / 2);
		    	}
		    } else {
	    		text.size += 2.5;
		    	ctx.beginPath();
			    ctx.font = 'bold ' + text.size + 'pt Tahoma';
			    ctx.fillStyle = 'white';
			    ctx.textAlign = 'center';
			    ctx.fillText(text.message, canvas.width / 2, canvas.height / 2);
			}
	    }

	    if (new Date().getTime() - last >= 5000) {
	    	last = new Date().getTime();
	    	console.log(last_data);
	    }
	}

    requestAnimationFrame(function() {
    	Game.main(socket);
    });
}

var app = angular.module('basketball', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/partials/login.html'
	})
	.when('/play', {
		templateUrl: '/partials/game.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.factory('socket', function($rootScope) {
	var socket = io.connect();

	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;

				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;

				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		},

		currentId: function() {
			return socket.id;
		}
	};
});

app.controller('LoginController', function($scope, $location, socket) {
	$scope.user = {};

	$scope.proceed = function() {
		if (!$scope.user || !$scope.user.name) {
			alert('Please enter a valid nickname.');
			return;
		}

		socket.emit('login', $scope.user);
	}

	socket.on('code', function(data) {
		$scope.user.code = data.code;
	});

	socket.on('login_response', function(data) {
		if (data.error) {
			alert(data.error);
		} else {
			$location.url('/play');
		}
	});
});

app.controller('GameController', function($scope, $location, socket) {
	socket.emit('join');

	socket.on('join_response', function(data) {
		if (data.error) {
			alert(data.error);
			location.href = '/';
			return;
		}

		var player;
		var canvas = document.createElement("CANVAS");
	    canvas.id = "map";
	    canvas.height = data.height;
	    canvas.width = data.width;
	    var div = document.getElementById('sky');
	    div.appendChild(canvas);

		$scope.send_message = function() {
			socket.emit('message', $scope.new_message);

			if ($scope.new_message.message && $scope.new_message.message[0] == '-') {
				if (player) {
					var time_held = parseInt($scope.new_message.message.substring(1));
					var ball = new Game.Ball(player.x + 30.0, player.y, time_held / 1000, time_held / 300);
					var distance = util.dist(player.x, player.y, 400, 140);
					ball.velocity.x += distance / 250;
					ball.velocity.y += distance / 500;
					balls.push(ball);
				}

				socket.emit('throw', {time_held: parseInt($scope.new_message.message.substring(1))});
			}

			$scope.new_message = {};
		}

		socket.on('message', function(data) {
			if (data && data.message) {
				$('#messages').prepend('<p class="messages">[' + data.creation + '] ' + data.name + ': ' + data.message + '</p>');
			}
		});

		var last_key_down = 0;
		var first_press = true;

		$(document).ready(function() {
			Game.main(socket);

			socket.on('update', function(data) {
				if (player && player.score < data.self.score && util.diff(player.score, data.self.score) == 1) {
					var score_sound = new Audio('./../audio/onScore.wav');
       				score_sound.play();
				}

				player = data.self;
				last_data = data;
			});

			socket.on('controller_throw', function(data) {
				balls.push(data.ball);
			});

			$(document.body).keydown(function(event) {
				if (document.activeElement && document.activeElement.id == 'message') {
					return;
				} 

				if (event.keyCode == 32) {
					event.preventDefault();
					var now = new Date().getTime();

					if (first_press) {
						last_key_down = now;
						first_press = false;
					}

					var time_held = (now - last_key_down);

					var color = '#ff7f7f';

					var colors = {
						1000: '#ff6666',
						2000: '#ff4c4c',
						3000: '#ff3232',
						4000: '#ff1919',
						5000: '#ff0000',
						6000: '#e50000',
					};

					for (var time in colors) {
						if (time_held > time) {
							color = colors[time];
						}
					}

					var height = $('#power_bar').css('height');
					$('#power_bar').css('height', (parseInt(height.substring(0, height.length - 1)) + 5) + 'px');

					if (time_held > 8500) {
						$('#power_bar').css('height', '0px');
						first_press = true;
						var time_held = (new Date().getTime() - last_key_down);

						if (player) {
							var ball = new Game.Ball(player.x + 30.0, player.y, time_held / 1000, time_held / 300);
							var distance = util.dist(player.x, player.y, 400, 140);
							ball.velocity.x += distance / 250;
							ball.velocity.y += distance / 500;
							balls.push(ball);
						}

						socket.emit('throw', {time_held: time_held});
					}
				} else if (event.keyCode == 37 || event.keyCode == 39) {
					event.preventDefault();
					socket.emit('move', {keyCode: event.keyCode});
				}
			});

			$(document.body).keyup(function(event) {
				if (document.activeElement && document.activeElement.id == 'message') {
					return;
				} 

				if (event.keyCode == 32) {
					event.preventDefault();

					if (!first_press) {
						$('#power_bar').css('height', '0px');
						first_press = true;
						var time_held = (new Date().getTime() - last_key_down);
						console.log('Thrown at: ' + time_held);

						if (player) {
							var ball = new Game.Ball(player.x + 30.0, player.y, time_held / 1000, time_held / 300);
							var distance = util.dist(player.x, player.y, 400, 140);
							ball.velocity.x += distance / 250;
							ball.velocity.y += distance / 500;
							balls.push(ball);
						}

						socket.emit('throw', {time_held: time_held});
					}
				}
			});
		});
	});
});