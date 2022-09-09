function Vehicle(name, wheels, speed, passengers) {
	this.name = name;
	this.wheels = wheels;
	this.speed = speed;
	this.passengers = passengers;
	this.distance_travelled = 0;
	this.vin = Math.floor(Math.random() * 100);
}

Vehicle.prototype.makeNoise = function() {
	console.log('null null null! :(');
};

Vehicle.prototype.updateDistanceTravelled = function() {
	this.distance_travelled += this.speed;
};

Vehicle.prototype.move = function() {
	this.updateDistanceTravelled();
	this.makeNoise();
};

Vehicle.prototype.checkMiles = function() {
	console.log(this.distance_travelled);
}

Vehicle.prototype.whatsMyVin = function() {
	console.log("Your VIN number is: " + this.vin);
}

var bike = new Vehicle('bike', 2, 15, 1);
bike.makeNoise = function() {
	console.log('ring ring!');
}

bike.makeNoise();
bike.whatsMyVin();

var sedan = new Vehicle('sedan', 4, 30, 2);
sedan.makeNoise = function() {
	console.log('Honk Honk!');
}

sedan.makeNoise();
sedan.whatsMyVin();

var bus = new Vehicle('buss', 6, 60, 10);
bus.pickUpPassengers = function(number_of_passengers) {
	bus.passengers += number_of_passengers;
}

console.log(bus.passengers);
bus.pickUpPassengers(5);
bus.move();
bus.checkMiles();
bus.whatsMyVin();