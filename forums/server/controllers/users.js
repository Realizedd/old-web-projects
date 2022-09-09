var bcrypt = require('bcrypt');
var User = require('./../models/user.js');
var Comment = require('./../models/comment.js');

module.exports = {
	self: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json({logged_in: false});
				return;
			}

			if (!req.session || !req.session.access_id) {
				res.json({logged_in: false});
				connection.release();
				return;
			}

			connection.query(User.GET_BY_ID, req.session.access_id, function(error, rows) {
				if (rows.length == 0) {
					connection.release();
					res.json({logged_in: false});
					return;
				}

				connection.release();
				res.json({logged_in: true, username: rows[0].username});
			});
		});
	},

	getOne: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			connection.query(User.GET_BY_ID, req.params.id, function(error, rows) {
				if (rows.length == 0) {
					connection.release();
					res.json({error: "No user found with that id."});
					return;
				}

				var user = rows[0];

				connection.query(Comment.ALL_COMMENTS_OF_ID, user.id, function(error, rows) {
					connection.release();
					res.json({id: user.id, username: user.username, created_at: user.created_at, group: user.group, comments: rows});
				});
			});
		});
	},

	register: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			console.log('Connected for REGISTER: ' + connection.threadId);

			// Validations

			var username = req.body.username;
			var email = req.body.email;
			var password = req.body.password;

			if (!username) {
				connection.release();
				res.json({error: 'Username field cannot be empty.'});
				return;
			}

			// Validate all the other fields here. Fail first!

			connection.query(User.GET_BY_EMAIL_AND_USERNAME, [email, username], function(error, rows) {
				if (error) {
					connection.release();
					res.json(error);
					return;
				}

				if (rows.length > 0) {
					connection.release();
					res.json({error: 'Username or email already exists on the database.'});
					return;
				}

				bcrypt.genSalt(10, function(error, salt) {
					if (error) {
						connection.release();
						res.json({error: 'Please type a valid password.'});
						return;
					}

					bcrypt.hash(password, salt, function(error, hash) {
						if (error) {
							connection.release();
							res.json({error: 'Please type a valid password.'});
							return;
						}

					    connection.query(User.CREATE, [username, email, hash, 1], function(error, rows) {
					    	if (error) {
								connection.release();
								res.json(error);
					    		return;
					    	}

							connection.release();
							req.session.access_id = rows.insertId;
							res.json({message: 'Successfully registered.'});
							return;
						});
					});
				});
			});
		});
	},

	login: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			console.log('Connected for LOGIN: ' + connection.threadId);
			console.log(req.session);

			// Validations

			var email = req.body.email;
			var password = req.body.password;

			// Validate all the other fields here. Fail first!

			connection.query(User.GET_BY_EMAIL, email, function(error, rows) {
				if (error) {
					connection.release();
					res.json(error);
					return;
				}

				if (rows.length == 0) {
					connection.release();
					res.json({error: 'No user found with that email.'});
					return;
				}

				var user = rows[0];

				bcrypt.compare(password, user.pw_hash, function(error, result) {
					if (error) {
						connection.release();
						res.json({error: 'Please type a valid password.'});
						return;
					}

					connection.release();
					// session stuff
					req.session.access_id = user.id;
					res.json({message: 'Successfully logged in.'});
				});
			});	
		});
	},

	logout: function(req, res) {
		delete req.session.access_id;
		res.json({message: 'Successfully logged out.'});
	}
};