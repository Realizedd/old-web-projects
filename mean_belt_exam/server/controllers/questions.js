var mongoose = require('mongoose');
var sanitizeHtml = require('sanitize-html');
var User 	 = mongoose.model('User');
var Question = mongoose.model('Question');

module.exports = {

	// Get all questions. Association is unnecessary since we only need the count of answers
	index: function(req, res) {
		Question.find({}, function(error, data) {
			if (error) {
				res.json(error);
			} else {
				res.json(data);
			}
		});
	},

	// Gets a question + associated answers
	show: function(req, res) {
		Question.findOne({_id: req.params.id}).populate('answers').exec(function(error, data) {
			if (error) {
				res.json(error);
			} else {
				res.json(data);
			}
		});
	},

	// Creates a new question
	create: function(req, res) {
		// Get current user for their actual name, no name spoofing in requests
		User.findOne({_id: req.cookies.user_id}, function(error, data) {
			if (error) {
				res.json(error);
			} else {
				var new_question = new Question({message: sanitizeHtml(req.body.message)});

				if (req.body.description && req.body.description != '') {
					new_question.description = sanitizeHtml(req.body.description);
				}

				new_question.name = data.name;

				new_question.save(function(error, data) {
					if (error) {
						res.json(error);
					} else {
						res.json(data);
					}
				});
			}
		});
	}
}