// require statements
var express 	= require('express'),
	body_parser = require('body-parser'),
	path		= require('path'),
	cookie_pasrser 	= require('cookie-parser');

var app = express();

// app settings
app.use(cookie_pasrser());
app.use(body_parser.json());
app.use(express.static(path.join(__dirname, './client')));

// more require statements
require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.listen(5000, function() {
	console.log('(mean_belt_exam) Listening on port 5000');
});