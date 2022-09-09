var express 	= require('express'),
	path 		= require('path'),
	body_parser = require('body-parser'),
	mongoose = require('mongoose'),
	app = express();

mongoose.connect('mongodb://localhost/mydb');

var QuoteSchema = new mongoose.Schema(
{
	name: { type: String },
	message: { type: String }
}, { timestamps: true });

mongoose.model('Quote', QuoteSchema);

var Quote = mongoose.model('Quote');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/quotes', function(req, res) {
	Quote.find('{}', function(error, data) {
		var quotes = [];

		if (!error) {
			quotes = data;
		} else {
			console.log('ERROR: ' + error);
		}

		res.render('quotes', {quotes: quotes});
	});
});

app.post('/quotes', function(req, res) {
	var quote = new Quote();
	quote.name = req.body.name;
	quote.message = req.body.message;
	quote.save(function(error) {
		if (error) {
			// Render error page
			res.send("ERROR: " + error);
		} else {
			res.redirect('/quotes');
		}
	});
});

app.listen(5000, function() {
	console.log('Listening to port 5000 (mongoose_test)');
});