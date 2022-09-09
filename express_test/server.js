var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

app.listen(5000, function() {
	console.log('Now listening to port 5000');
});