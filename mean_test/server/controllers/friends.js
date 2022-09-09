var mongoose = require('mongoose'),

	Friend	 = mongoose.model('Friend');

module.exports = (function() {
	return {
		// Retrives all friends from the db
		index: function(req, res) {
			Friend.find({}, function(error, data) {
				if (error) {
					// Log if there are any errors
					console.log('Error while running query: ' + error);
				} else {	
					res.json(data);
				}
			});
		},

		// Inserts a new friend to the db, returns updated friends list
		create: function(req, res) {
			var new_friend = new Friend(req.body);

			new_friend.save(function(error) {
				if (error) {
					console.log('Error while running query: ' + error);
				} else {
					res.redirect('/friends');
				}
			});
		},

		delete: function(req, res) {
			Friend.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(error) {
				if (error) {
					console.log('Error while running query: ' + error);
				} else {
					res.send('Delete successful');
				}
			});
		}
	}
})();