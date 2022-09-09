var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

var QuestionSchema = new mongoose.Schema({
	name: {type: String, required: true},
	message: {type: String, required: true},
	description: String,
	answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}]
}, {timestamps: true});

mongoose.model('Question', QuestionSchema);