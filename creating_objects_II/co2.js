function VehicleConstructor(name, wheels, speed, passengers) {
	var distance_travelled = 0;
	var self = this;

	var updateDistanceTravelled = function() {
		distance_travelled += self.speed;
	}

	this.name = name;
	this.wheels = wheels;
	this.speed = speed;
	this.passengers = passengers;
	this.makeNoise = function() {
		console.log('null null null! :(');
	}

	this.move = function() {
		updateDistanceTravelled();
		this.makeNoise();
	}

	this.checkMiles = function() {
		console.log(distance_travelled);
	}
}

var bike = new VehicleConstructor('bike', 2, 15, 1);
bike.makeNoise = function() {
	console.log('ring ring!');
}

bike.makeNoise();

var sedan = new VehicleConstructor('sedan', 4, 30, 2);
sedan.makeNoise = function() {
	console.log('Honk Honk!');
}

sedan.makeNoise();

var bus = new VehicleConstructor('buss', 6, 60, 10);
bus.pickUpPassengers = function(number_of_passengers) {
	bus.passengers += number_of_passengers;
}

console.log(bus.passengers);
bus.pickUpPassengers(5);
bus.move();
bus.checkMiles();