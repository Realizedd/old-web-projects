// require statements <
var express 	= require('express'),
	path 		= require('path'),
	body_parser = require('body-parser'),
	mongoose 	= require('mongoose'),

// require statements >

	app 		= express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

// Mongoose handling <

mongoose.connect('mongodb://localhost/mydb');

var LionSchema = new mongoose.Schema( {

	name: {type: String, required: true},
	age: {type: Number, required: true, min: 1}

}, {timestamps: true} );

mongoose.model('Lion', LionSchema);

var Lion = mongoose.model('Lion');

// Mongoose handling >

// Routes <

	// Displays all lions
app.get('/', function(req, res) {
	Lion.find('{}', function(errors, data) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.render('index', {lions: data});
		}
	});
});

	// Displays the 'create new lion' page
app.get('/lions/new', function(req, res) {
	res.render('new');
});

	// Displays info about a specific lion
app.get('/lions/:id/show', function(req, res) {
		Lion.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors, data) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.render('show', {lion: data});
		}
	});
});

	// Sent when client creates a new lion via /lions/new
app.post('/lions', function(req, res) {
	var lion = new Lion({name: req.body.name, age: req.body.age});
	lion.save(function(errors) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.redirect('/');
		}
	});
});

	// Displays the 'edit lion' page
app.get('/lions/:id/edit', function(req, res) {
	Lion.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors, data) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.render('edit', {lion: data});
		}
	});
});

	// Sent when client finishes editing a lion via /lions/:id/edit, used to update a lion
app.post('/lions/:id', function(req, res) {
	Lion.update({_id: mongoose.Types.ObjectId(req.params.id)}, {name: req.body.name, age: req.body.age}, function(errors) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.redirect('/');
		}
	});
});

	// Sent when client decides to delete the lion on the edit page
app.post('/lions/:id/destroy', function(req, res) {
	Lion.remove({_id: mongoose.Types.ObjectId(req.params.id)}, function(errors) {
		if (errors) {
			res.render('index', {errors: errors});
		} else {
			res.redirect('/');
		}	
	});
});

// Routes >


app.listen(5000, function() {
	console.log('(mongoose_dashboard) Listening to port 5000');
});