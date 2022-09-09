var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	name: {type: String, validate: {
		validator: function(v) {
			return v.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
		},
		message: 'Name must be alphabetic.'
	}, required: [true, 'Name cannot be empty.']}
}, {timestamps: true});

mongoose.model('User', UserSchema);