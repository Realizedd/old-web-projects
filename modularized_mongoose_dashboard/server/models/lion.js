var mongoose = require('mongoose'),

LionSchema	 = new mongoose.Schema( {
	name: {type: String, required: true},
	age: {type: Number, required: true, min: 1}

}, {timestamps: true} );

var Lion = mongoose.model('Lion', LionSchema);