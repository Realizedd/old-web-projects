var mongoose = require('mongoose'),

	Lion 	 = mongoose.model('Lion');

module.exports = {
	show: function(req, res) {
		Lion.find('{}', function(errors, data) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.render('index', {lions: data});
			}
		});
	},

	new: function(req, res) {
		res.render('new');
	},

	show_one: function(req, res) {
		Lion.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors, data) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.render('show', {lion: data});
			}
		});
	},

	save: function(req, res) {
		var lion = new Lion({name: req.body.name, age: req.body.age});
		lion.save(function(errors) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.redirect('/');
			}
		});
	},

	edit: function(req, res) {
		Lion.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors, data) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.render('edit', {lion: data});
			}
		});
	},

	update: function(req, res) {
		Lion.update({_id: mongoose.Types.ObjectId(req.params.id)}, {name: req.body.name, age: req.body.age}, function(errors) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.redirect('/');
			}
		});
	},

	destroy: function(req, res) {
		Lion.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors) {
			if (errors) {
				res.render('index', {errors: errors});
			} else {
				res.redirect('/');
			}	
		});
	}
};