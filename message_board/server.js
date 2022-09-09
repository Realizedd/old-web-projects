// require statements <

var express 	= require('express'),
	path 		= require('path'),
	body_parser = require('body-parser'),
	mongoose 	= require('mongoose'),

// require statements >

	app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(body_parser.urlencoded({extended: true}));

// Mongoose handling <

mongoose.connect('mongodb://localhost/mydb');

var Schema = mongoose.Schema;
var MessageSchema = new mongoose.Schema( {

	name: {type: String, required: true, minlength: 4},
	text: {type: String, required: true},
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

}, {timestamps: true} );

var CommentSchema = new mongoose.Schema({

	name: {type: String, required: true, minlength: 4},
	text: {type: String, required: true},
	_message: {type: Schema.Types.ObjectId, ref: 'Message'}

}, {timestamps: true});

mongoose.model('Message', MessageSchema);
mongoose.model('Comment', CommentSchema);

var Message = mongoose.model('Message');
var Comment = mongoose.model('Comment');

// Mongoose handling >


// Routes handling <

function asyncLoop(i, messages, res) {
	if (i < messages.length) {
		Message.findOne({_id: messages[i]._id}).populate('comments').exec(function(error, message_with_comments) {
			if (error) {
				res.render('index', {error: error});
			} else {
				messages[i] = message_with_comments;
				asyncLoop(i + 1, messages, res);
			}
		});
	} else {
		res.render('index', {messages: messages.reverse()});
	}
}

app.get('/', function(req, res) {
	Message.find('{}', function(error, messages) {
		if (error) {
			res.render('index', {error: error});
		} else {
			asyncLoop(0, messages, res);
		}
	});
});

app.post('/add_message', function(req, res) {
	var message = new Message({name: req.body.name, text: req.body.text, comments: []});
	message.save(function(error) {
		if (error) {
			res.render('index', {error: error});
		} else {
			res.redirect('/');
		}
	});
});

app.post('/add_comment', function(req, res) {
	if (typeof(req.body._id) == 'undefined') {
		res.render('index', {error: 'id not found.'});
	} else {
		Message.findOne({_id: mongoose.Types.ObjectId(req.body._id)}, function(error, message) {
			if (error) {
				res.render('index', {error: error});
			} else {
				var comment = new Comment({name: req.body.name, text: req.body.text});
				comment._message = message._id;
				comment.save(function(error) {
					if (error) {
						res.render('index', {error: error});
					} else {
						message.comments.push(comment);
						message.save(function(error) {
							if (error) {
								res.render('index', {error: error});
							} else {
								res.redirect('/');
							}
						});
					}
				});
			}
		});
	}
});

// Routes handling >

app.listen(5000, function() {
	console.log('(message_board) Listening to port 5000');
});