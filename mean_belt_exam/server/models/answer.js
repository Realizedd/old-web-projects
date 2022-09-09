var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema = new mongoose.Schema({
	name: {type: String, required: true},
	message: {type: String, required: true, minlength: 5},
	description: String,
	likes: Number,
	_question: {type: Schema.Types.ObjectId, ref: 'Question'}
}, {timestamps: true});

mongoose.model('Answer', AnswerSchema);