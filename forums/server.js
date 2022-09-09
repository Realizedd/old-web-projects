// required libraries
var bodyParser   = require('body-parser'),
	session 	 = require('express-session'),
	path	     = require('path'),
	express      = require('express');

// App declaration
var app = express();

app.use(bodyParser.json());
app.use(
	session({
		secret: '953928b1-0d17-4031-a42c-528aa209877',
	 	resave: false,
	 	saveUninitialized: true
	})
);
app.use(express.static(path.join(__dirname, './client')));

var pool = require('./server/config/mysql.js');

require('./server/config/routes.js')(app, pool);

// App launch
app.listen(5000, function() {
	console.log('[forums] Listening on port 5000.');
});