var person = {
	name: 'Trey',
	distance_traveled: 0,
	say_name: function() {
		console.log(person.name);
	},
	say_something: function(msg) {
		console.log("Trey says '" + msg + "'");
	},
	walk: function() {
		console.log('Trey is walking');
		person.distance_traveled += 3;
	},
	run: function() {
		console.log('Trey is running');
		person.distance_traveled += 10;
	},
	crawl: function() {
		console.log('Trey is crawling');
		person.distance_traveled += 1;
	}
}

person.run();
person.say_something('thank you');
person.crawl();
person.say_name();