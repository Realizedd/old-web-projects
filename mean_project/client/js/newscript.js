function createCanvas() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = document.createElement("CANVAS");
    canvas.id = "my_canvas";
    canvas.height = 400;
    canvas.width = 800;
    var div = document.getElementById('sky');
    div.appendChild(canvas);
}

var requestAnimationFrame = 
	window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

createCanvas();

var canvas = document.getElementById("my_canvas");

var killed = false;
var x = 100;
var xmode = true;
var ctx = canvas.getContext('2d');
var objects = [];

function createDrop(event) {
	var positions = getCursorPosition(canvas, event);

	objects.push(

	{	
		x: positions.x,
    	y: positions.y
	}

	);

	console.log('Drop created at ' + positions.x + ', ' + positions.y);
}

function repeated_task() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (x <= 0) {
		xmode = true;
	} else if (x >= 750) {
		xmode = false;
	}

	for (var i = 0; i < objects.length; i++) {
		var curr = objects[i];
		ctx.beginPath();
		ctx.arc(curr.x, curr.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = 'darkgray';
        ctx.fill();
        ctx.closePath();
        curr.y += 5;

        var dead = false;

        if (curr.y >= 400) {
        	objects.splice(i, 1);
        	i--;
        	dead = true;
        }

        if (!dead) {
	        if (!killed && diff(curr.x, x) <= 30 && diff(curr.y, 350) <= 20) {
	        	killed = true;

	    		// Play explosion gif
	    		objects.splice(i, 1);
	    		i--;
	        }
    	}
	}

	if (!killed) {
		ctx.beginPath();
		console.log(document.getElementById('player'));
		ctx.drawImage(document.getElementById('player'), xmode ? x += 5 : x -= 5, 300);
		ctx.closePath();

		// ctx.fillStyle = 'red';
		// ctx.fillRect(xmode ? x += 5 : x -= 5, 350, 50, 50);
		// ctx.closePath();
	}
	
	requestAnimationFrame(repeated_task);
}

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {x: event.clientX - rect.left, y: event.clientY - rect.top};
}

function diff(a, b) {
    return Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b));
}

window.onload = function() {
	$(document.body).keydown(function(event) {
		console.log(event.key);
		x -= 12;
	});

	$('#my_canvas').click(function(event) {
		createDrop(event);
	});

	repeated_task();
}