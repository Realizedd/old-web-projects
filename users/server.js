// require statements <
var express 	= require('express'),
	body_parser = require('body-parser'),
	path 		= require('path'),
// require statements >

	app 		= express();

app.use(body_parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './client/static')));

var routes_setter = require('./server/config/routes.js');
routes_setter(app);

app.listen(5000, function() {
	console.log('(users) Listening to port 5000');
});