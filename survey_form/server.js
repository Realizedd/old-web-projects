var express = require('express');
var body_parser = require('body-parser');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, './static')));
app.use(body_parser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('index');
});

app.post('/result', function(request, response) {
	console.log(request.body);
	response.render('result', {result: request.body});
});

app.listen(5000, function() {
	console.log('(Survey Form) Now listening to port 5000');
});