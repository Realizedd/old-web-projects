var friends = require('./../controllers/friends.js');

module.exports = function(app) {
	app.get('/friends', function(req, res) {
		friends.index(req, res);
	});

	// Handles client creating a new friend
	app.post('/friends', function(req, res) {
		friends.create(req, res);
	});

	app.delete('/friends/:id', function(req, res) {
		friends.delete(req, res);
	})
}