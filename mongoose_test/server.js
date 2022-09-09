var express  = require('express'),
	path     = require('path'),
	body_parser = require('body-parser'),
	mongoose = require('mongoose'),
	app 	 = express();

mongoose.connect('mongodb://localhost/mydb');

var UserSchema = new mongoose.Schema(
{
 name: { type: String },
 age: { type: Number }
}, { timestamps: true });

mongoose.model('User', UserSchema);

var User = mongoose.model('User');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.get('/', function(req, res) {
	User.find('{name: "Samuel Lim"}', function(error, data) {
		var users = [];

		if (!error) {
			users = data;
		} else {
			console.log('ERROR: ' + error);
		}

		// Render when done (?)
		res.render('index', {users: users});
	});
});

app.post('/add_user', function(req, res) {
	console.log(req.body);
	var new_user = new User({name: req.body.name, age: req.body.age});

	new_user.save(function(error) {
		if (error) {
			console.log('ERROR: ' + error);
		}

		res.redirect('/');
	});
});

app.listen(5000, function() {
	console.log('Listening to port 5000 (mongoose_test)');
});