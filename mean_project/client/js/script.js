var circlesArr = [];
var foods = [];

var PLAYERINSTANCE = null;
const COLORS = [
    "#000000", "#FF0000", 
    "#00FF00", "#0000FF", 
    "#FFFF00", "#00FFFF", 
    "#FF00FF", "#C0C0C0"
];

var socket = io.connect();

socket.on('connect', function() {
    console.log('Connection success.');
    var name = prompt('Type your nickname');
    PLAYERINSTANCE = makeCircle((window.innerWidth / 2), (window.innerHeight / 2), 20, name, socket.json.id, false);
    socket.emit('join', PLAYERINSTANCE);

    $(document).ready(function() {
        renderCircle();
    });
});

function createCanvasObject() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasObject = document.createElement("CANVAS");
    canvasObject.id = "balls";
    canvasObject.height = 600;
    canvasObject.width = 1300;
    var canvasdiv = document.getElementsByClassName("canvasspace");
    canvasdiv[0].appendChild(canvasObject);
}

function Circle(x, y, radius, name, id) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.id = id;
    this.radius = radius;
    this.xvelocity = 0;
    this.yvelocity = 0;
    var colorn = Math.floor(Math.random() * 8);
    this.color = COLORS[colorn];
}

var requestAnimationFrame = 
	window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

createCanvasObject();

var canvas = document.getElementById('balls');
var ctx = canvas.getContext("2d");

var lastRandomFood = 0;

function renderCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < foods.length; i++) {
        var current = foods[i];

        ctx.beginPath();
        ctx.arc(current.x, current.y, current.radius, 0, 2 * Math.PI);
        ctx.fillStyle = current.color;
        ctx.fill();
        ctx.closePath();
        ctx.font = 'bold 10pt Calibri';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(current.name, current.x, current.y + 5);

        var dx = PLAYERINSTANCE.x - current.x;
        var dy = PLAYERINSTANCE.y - current.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= current.radius + PLAYERINSTANCE.radius) {
            foods.splice(i, 1);
            PLAYERINSTANCE.radius += 0.5;
            i--;
        }
    }

    if (getTime() - lastRandomFood > 10000 && foods.length < 10) {
        for (var i = 0; i < 30; i++) {
            var food = makeCircle(randrange(0, 900), randrange(0, 600), 10, "", null, true);
        }

        lastRandomFood = getTime();
    }

    for (var i = 0; i < circlesArr.length; i++) {
        var current = circlesArr[i];

        ctx.beginPath();
        console.log(current.radius);
        ctx.arc(current.x, current.y, current.radius, 0, 2 * Math.PI);
        ctx.fillStyle = current.color;
        ctx.fill();
        ctx.closePath();
		ctx.font = 'bold 10pt Calibri';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText(current.name, current.x, current.y + 5);

        var dx = PLAYERINSTANCE.x - current.x;
        var dy = PLAYERINSTANCE.y - current.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (current.id.substring(2) != socket.id.substring(2)) {
            continue;
        }

        if ((current.y >= canvas.height - current.radius) || ((current.y - current.radius) < 0)) {
            current.yvelocity = (current.y >= canvas.height - current.radius) ? -20 : 20;
        }

        if ((current.x >= canvas.width - current.radius) || ((current.x - current.radius) < 0)) {
            current.xvelocity = (current.x >= canvas.width - current.radius) ? -20 : 20;
        }

        current.y += current.yvelocity;
        current.x += current.xvelocity;
        socket.emit('move', {x: current.x, y: current.y, radius: current.radius});
    }

    $('#score').text('Score: ' + PLAYERINSTANCE.radius);
    requestAnimationFrame(renderCircle);
}

function getTime() {
    var date = new Date();
    return date.getTime();
}

function randrange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCircle(x, y, radius, name, id, isFood) {
    var newCircle = new Circle(x, y, radius, name, id);

    if (isFood) {
        foods.push(newCircle);
    } else {
        circlesArr.push(newCircle);
        console.log('Created Circle ' + JSON.stringify(newCircle));
    }
    return newCircle;
}

socket.on('join', function(data) {
    console.log('JOIN: ' + JSON.stringify(data));
    makeCircle(data.x, data.y, data.radius, data.name, data.id, false);
});

socket.on('players', function(data) {
    console.log("PLAYERS: " + JSON.stringify(data));
    for (var key in data) {
        makeCircle(data[key].x, data[key].y, data[key].radius, data[key].name, key, false);
    }
});

socket.on('move', function(data) {
    // console.log('Received move ' + JSON.stringify(data));
    for (var i in circlesArr) {
        if (circlesArr[i].id == data.id) {
            circlesArr[i].x = data.x;
            circlesArr[i].y = data.y;
            circlesArr[i].radius = data.radius;
            break;
        }
    }
});

socket.on('quit', function(data) {
    for (var i in circlesArr) {
        if (circlesArr[i].id == data.id) {
            circlesArr.splice(i, 1);
            break;
        }
    }
});

function moveInstance(event) {
    var x = event.clientX;
    var y = event.clientY;

    var dx = PLAYERINSTANCE.x - x;
    var dy = PLAYERINSTANCE.y - y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var v = dist / 100;

    if (v < 0.0) {
        v = 0;
    } else if (v > 3.0) {
        v = 3.0;
    }

    if (x > PLAYERINSTANCE.x) {
        if (diff(PLAYERINSTANCE.xvelocity, v) >= 3) {
            PLAYERINSTANCE.xvelocity -= v;
        } else {
            PLAYERINSTANCE.xvelocity = v;
        }
    } else {
        if (diff(PLAYERINSTANCE.xvelocity, v) >= 3) {
            PLAYERINSTANCE.xvelocity += v;
        } else {
            PLAYERINSTANCE.xvelocity = -v;
        }
    }

    if (y > PLAYERINSTANCE.y) {
        if (diff(PLAYERINSTANCE.yvelocity, v) >= 3) {
            PLAYERINSTANCE.yvelocity -= v;
        } else {
            PLAYERINSTANCE.yvelocity = v;
        }
    } else {
        if (diff(PLAYERINSTANCE.yvelocity, v) >= 3) {
            PLAYERINSTANCE.yvelocity += v;
        } else {
            PLAYERINSTANCE.yvelocity = -v;
        }
    }
}

function diff(a, b) {
    return Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b));
}