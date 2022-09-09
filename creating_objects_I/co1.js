function VehicleConstructor(name, wheels, passengers) {
	var vehicle = {
		name: name,
		wheels: wheels,
		passengers: passengers,
		makeNoise: function() {
			console.log('null null null! :(');
		}
	}

	return vehicle;
}

var bike = VehicleConstructor('bike', 2, 1);
bike.makeNoise = function() {
	console.log('ring ring!');
}

bike.makeNoise();

var sedan = VehicleConstructor('sedan', 4, 2);
sedan.makeNoise = function() {
	console.log('Honk Honk!');
}

sedan.makeNoise();

var bus = VehicleConstructor('buss', 6, 10);
bus.pickUpPassengers = function(number_of_passengers) {
	bus.passengers += number_of_passengers;
}

console.log(bus.passengers);
bus.pickUpPassengers(5);
console.log(bus.passengers);