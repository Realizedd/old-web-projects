var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {

	// Find user data of the request. Not so restful :(
	index: function(req, res) {
		User.findOne({_id: req.cookies.user_id}, function(error, data) {
			if (error) {
				res.json({errors: {name: {message: 'User not found'}}});
			} else {
				res.json(data);
			}
		});
	},

	// Login / Register process
	create: function(req, res) {
		// Checks if user exists
		User.findOne({name: req.body.name}, function(error, data) {
			if (error) {
				res.json(error);
			} else if (data) {
				// If user exists, check cookies for matching id
				if (req.cookies.user_id && req.cookies.user_id == data._id) {
					// If matches, return user data
					res.json(data);
				} else {
					// Else, send error
					res.json({errors: {name: {message: 'A user with that name already exists.'}}});
				}
			} else {
				// If user doesn't exist, generate
				var new_user = new User(req.body);

				new_user.save(function(error, data) {
					if (error) {
						console.log(error);
						res.json(error);
					} else {
						res.cookie('user_id', data._id, {maxAge: 900000});
						res.json(data);
					}
				});
			}
		});
	},

	// Logout proccess
	delete: function(req, res) {
		// Have to delete the user on logout since cookies HAVE TO be cleared, I'm sure there's a better way to persist the data.
		User.remove({_id: req.cookies.user_id}, function(error) {
			if (error) {
				res.json({errors: {name: {message: 'User not found'}}});
			} else {
				res.clearCookie('user_id');
				res.json({message: 'User removed'});
			}
		});
	}
};