function personConstructor(name) {
	var person = {
		name: name,
		distance_traveled: 0,
		say_name: function() {
			alert(person.name);
		},
		say_something: function(msg) {
			console.log(person.name + " says '" + msg + "'");
		},
		walk: function() {
			console.log(person.name + " is walking");
			person.distance_traveled += 3;
		},
		run: function() {
			console.log(person.name + " is running");
			person.distance_traveled += 10;
		},
		crawl: function() {
			console.log(person.name + " is crawling");
			person.distance_traveled += 1;
		}
	}

	return person;
}

function ninjaConstructor(name, cohort) {
	var ninja = {
		name: name,
		cohort: cohort,
		belt_level: 8,
		levelUp: function() {
			ninja.belt_level++;
			console.log(ninja.name + " has leveled up to LEVEL " + ninja.belt_level);
		}
	}

	return ninja;
}

person = personConstructor('Samuel');
person.say_something('hello!');

ninja = ninjaConstructor('NullPointerException');
ninja.levelUp();