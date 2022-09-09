// require statements <
var express 	= require('express'),
	path		= require('path'),
	body_parser	= require('body-parser'),
// >

	app 		= express();

app.use(body_parser.json());
app.use(express.static(path.join(__dirname, '/client')));

require('./server/config/mongoose.js');
require('./server/config/routes.js')(app);

app.listen(5000, function() {
	console.log('(mean_test) Now listening to port 5000');
});