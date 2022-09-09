var mongoose 	 = require('mongoose'),

	FriendSchema = new mongoose.Schema({
		name: String,
		age: Number
	});

mongoose.model('Friend', FriendSchema);
