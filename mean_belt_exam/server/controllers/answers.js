var mongoose = require('mongoose');
var sanitizeHtml = require('sanitize-html');
var User 	 = mongoose.model('User');
var Question = mongoose.model('Question');
var Answer 	 = mongoose.model('Answer');

module.exports = {

	// Creates an answer by the question id
	create: function(req, res) {
		User.findOne({_id: req.cookies.user_id}, function(error, user) {
			Question.findOne({_id: req.params.id}, function(error, question) {
				var answer = new Answer({message: sanitizeHtml(req.body.message)});

				if (req.body.description && req.body.description != '') {
					answer.description = sanitizeHtml(req.body.description);
				}

				answer.name = user.name;
				answer.likes = 0;
				answer._question = question;

				answer.save(function(error, data) {
					if (error) {
						res.json(error);
					} else {
						question.answers.push(answer);
						question.save(function(error) {
							if (error) {
								res.json(error);
							} else {
								res.json(data);
							}
						});
					}
				});
			});
		});
	},

	// Adds a like to an answer. Not so restful :(
	like: function(req, res) {
		Answer.findOne({_id: req.params.id}, function(error, answer) {
			answer.likes++;
			answer.save(function(error, answer) {
				if (error) {
					res.json(error);
				} else {
					res.json(answer);
				}
			});
		})
	}

}