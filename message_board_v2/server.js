var express    = require('express'),
	bodyParser = require('body-parser'),
	path	   = require('path'),
	mongoose   = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + './static'));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/messageBoardRedux');

var Schema = mongoose.Schema;

var messageSchema = new mongoose.Schema({
	name: {type: String, required: true},
 	text: {type: String, required: true}, 
 	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true});

mongoose.model('Message', messageSchema);

var Message = mongoose.model('Message');

var commentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	text: {type: String, required: true},
 	_message: {type: Schema.Types.ObjectId, ref: 'Message'}
}, {timestamps: true});

mongoose.model('Comment', commentSchema);

var Comment = mongoose.model('Comment');

app.get('/', function(req, res) {
	Message.find({}).populate('comments').exec(function(errors, messages) {
		console.log(JSON.stringify(messages));
		res.render('index', {messages: messages});
	});
});

app.post('/messages', function(req, res) {
	var message = new Message({name: req.body.name, text: req.body.message});
	message.save(function(errors) {
		res.redirect('/');
	});
});

app.post('/messages/:id', function(req, res) {
	Message.findOne({_id: req.params.id}, function(errors, message) {
		var comment = new Comment({name: req.body.name, text: req.body.message});
		comment._message = message._id;
		message.comments.push(comment);

		comment.save(function(errors) {
			message.save(function(errors) {
				if(errors) {
					console.log('Error'); 
				} else {
					res.redirect('/'); 
				}
			});
		});
	});
});

var server = app.listen(5000, function() {
	console.log('MessageBoard now running on port 5000!');
});