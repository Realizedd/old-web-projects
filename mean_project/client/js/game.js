var Game = {};
var score = 0;

(function() {
	function Player(x, y, maxWidth, maxHeight) {
		this.x = x;
		this.y = y;
		this.speed = 1.0;
		this.maxSpeed = 5.0;
		this.maxWidth = maxWidth;
		this.maxHeight = maxHeight;
		this.moved = null;
		this.last_animation = null;
	}

	Player.prototype.move = function(key) {
		switch (key) {
			case 37:
				if (this.x - 2.5 >= 0) {
					if (this.speed == this.maxSpeed) {
						this.x -= this.speed;
					} else {
						this.x -= ++this.speed;
					}
				}

				this.moved = "left";
				break;
			case 39:
				if (this.x + 60 < this.maxWidth) {
					if (this.speed == this.maxSpeed) {
						this.x += this.speed;
					} else {
						this.x += ++this.speed;
					}
				}

				this.moved = "right";
		}
	};

	Game.Player = Player;
})();

(function(window) {
    var canvas = document.createElement("CANVAS");
    canvas.id = "map";
    canvas.height = 400;
    canvas.width = 800;
    var div = document.getElementById('sky');
    div.appendChild(canvas);
})(window);


(function() {
	function Hoop(start, end) {
		this.start = start;
		this.end = end;
	}

	Hoop.prototype.is_score = function(ball) {
		// Checks if the ball iss inside the hoop
		var xrange = (ball.x > this.start.x && ball.x < this.end.x);
		var yrange = (ball.y > this.end.y) && diff(ball.y, this.end.y) <= 17.0;

		// Ball has to be falling to score
		if (ball.fall_distance != 0.0 && xrange && yrange && !ball.goaled) {
			var distance = Math.round(dist(ball.thrower_loc.x, ball.x, ball.thrower_loc.y, ball.y) / 100.0);
			console.log('Goal! New Score: ' + (distance >= 3 ? score += 3 : score += 2));
			$('#scores').append('<tr><td class="score">' + score + '</td><td class="range">' + distance + '</td></tr>');
			ball.goaled = true;
			return;
		}

		// Prevent any actions if goaled is set, even if false
		if (ball.goaled != undefined || ball.fall_distance == 0.0) {
			return;
		}

		// Case #1
		// If-statement arguments:
		// 1: Checks if ball has actually bounced off the start of the hoop.
		// 2: Prevents goal bouncing off inside the hoop by checking current Y.

		if ((ball.x < this.start.x && diff(ball.x, this.start.x) <= 15.0) && diff(ball.y, this.start.y) <= 17.0) {
			ball.goaled = false;
			ball.bounce_reason = 'hit';
			ball.fall_distance = 0.0;
			ball.fall_speed = 0.56;
			ball.velocity = {x: -3, y: 5};
			return;
		}


		// Case #2
		// If-statement arguments:
		// Checks if ball.x has passed or in the wall.x.
		// Checks if ball.y is in or lower than wall.y.

		if (diff(ball.x, 502.0) <= 17.0 && diff(ball.y, 152.0) <= 15.0) {
			console.log('Case #2');
			ball.goaled = false;
			ball.bounce_reason = 'hit';
			ball.fall_distance = 0.0;
			ball.fall_speed = 0.56;
			ball.velocity = {x: -3, y: 5};
			return;
		}

		// Case #3
		// If-statement arguments:
		// Checks if ball has actually bounced off the end of the hoop.
		// 2: Prevents goal bouncing off inside the hoop by checking current Y.
		
		if (ball.x >= this.end.x && diff(ball.x, this.end.x) <= 100.0 && diff(ball.y, this.start.y) <= 17.0) {
			console.log('Case #3');
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

var objects = [];

function createDrop(x, y, xvelocity, yvelocity) {
	objects.push(

	{	
		x: x,
    	y: y,
    	fall_distance: 0.0,
    	fall_speed: 0.1,
    	bounce_power: 8,
    	bounce_reason: 'fall',
    	// OLD: velocity: {x: 7.5, y: 15.0}
    	velocity: {x: 7.5, y: yvelocity},
    	thrower_loc: {x: x, y: y},
    	creation: new Date().getTime()
	}

	);
}


function diff(a, b) {
    return Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b));
}

function dist(x1, y1, x2, y2) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.sqrt(dx * dx + dy * dy);
}

var player = new Game.Player(0, 300, 400, 400);
var hoop = new Game.Hoop({x: 440, y: 207}, {x: 465, y: 207});
var canvas = document.getElementById('map');
var ctx = canvas.getContext('2d');

var requestAnimationFrame = 
	window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

Game.run = function() {
	var image = 'still';

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();
	ctx.drawImage(document.getElementById(image), player.x, player.y);
	ctx.closePath();

	for (var i = 0; i < objects.length; i++) {
		var curr = objects[i];
		ctx.beginPath();
		ctx.arc(curr.x, curr.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'darkorange';
        ctx.fill();
        ctx.closePath();

        if (curr.velocity.y > 0.0) {
        	curr.y -= (curr.velocity.y -= 0.5);
        	// console.log(curr.velocity.y);
        } else {
        	// curr.y += (curr.fall_distance += 0.1);
        	curr.y += (curr.fall_distance += curr.fall_speed);
        }

        if (Math.abs(curr.velocity.x) > 0.1) {
    		curr.x += (curr.velocity.x > 0 ? (curr.velocity.x -= 0.05) : (curr.velocity.x += 0.05));
        }

        // Fell on ground, reset fall distance + y to prevent continous fall through the map.
        if (curr.y >= 380.0) {
        	curr.y = 380.0;
       		curr.fall_distance = 0.0;

       		if (curr.bounce_power > 0) {
      			if (curr.bounce_power == 8) {
      				// curr.velocity.x = Math.random() > .5 ? -5 : 5;
      				curr.velocity.x = curr.bounce_reason == 'fall' ? 5 : -5;
      			}

       			curr.velocity.y = (curr.bounce_power -= 1);
       		}
        } else {
        	hoop.is_score(curr);
        }
	}

	ctx.beginPath();
    ctx.drawImage(document.getElementById('hoop'), 400, 140);
    ctx.closePath();

	player.last_animation = image;
	requestAnimationFrame(Game.run);
}

Game.play = function() {
    Game.run();
};

var last_key_down = 0;
var first_press = true;

window.onload = function() {
	Game.play();

	$(document.body).keydown(function(event) {
		event.preventDefault();
		player.move(event.keyCode);

		if (event.keyCode == 32) {
			var now = new Date().getTime();

			if (first_press) {
				last_key_down = now;
				first_press = false;
				console.log("LKD: " + last_key_down);
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

			$('#throwing_power').append('<div style="height: 1%; width: 100%; background-color: ' + color + ';"></div>');

			if (time_held > 8600) {
				$('#throwing_power').empty();
				first_press = true;
				var time_held = (new Date().getTime() - last_key_down);
				createDrop(player.x + 30.0, player.y, time_held / 50, time_held / 340);
			}
		}
	});

	$(document.body).keyup(function(event) {
		event.preventDefault();

		if (event.keyCode == 32 && !first_press) {
			$('#throwing_power').empty();
			first_press = true;
			var time_held = (new Date().getTime() - last_key_down);
			createDrop(player.x + 30.0, player.y, time_held / 50, time_held / 340);
		}
	});
}



