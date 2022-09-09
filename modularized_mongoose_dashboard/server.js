// require statements <
var express 	= require('express'),
	path 		= require('path'),
	body_parser = require('body-parser'),
	mongoose 	= require('mongoose'),

// require statements >

	app 		= express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './client/views'));

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './client/static')));

require('./server/config/mongoose.js');

var routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(5000, function() {
	console.log('(modularized_mongoose_dashboard) Listening to port 5000');
});