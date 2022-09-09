var mongoose = require('mongoose'),

	Person 	 = mongoose.model('Person');

module.exports = {

	show: function(req, res) {
		Person.find('{}', function(error, data) {
			res.json(data);
		});
	},

	create: function(req, res) {
		var person = new Person({name: req.params.name});
		person.save(function(error) {
			res.json(person);
		});
	},

	delete: function(req, res) {
		Person.remove({name: req.params.name}, function(error) {
			res.redirect('/');
		}, true);
	},

	view: function(req, res) {
		Person.findOne({name: req.params.name}, function(error, data) {
			res.json(data);
		});
	}
};