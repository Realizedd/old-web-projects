var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var users = [];

app.get('/', function(request, response) {
	response.render('index', {users: users});
});

app.post('/result', function(request, response) {
	users.push(request.body.name);

	response.render('result', {
		name: request.body.name, 
		location: request.body.location, 
		language: request.body.language, 
		comment: request.body.comment
	});
});

app.post('/delete/:id', function(request, response) {
	users.splice(request.params.id, 1);
	response.redirect('/');
});

app.listen(5000, function() {
	console.log('Listening on port 5000');
});