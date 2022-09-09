var persons = require('../controllers/persons.js');

module.exports = function(app) {
	app.get('/persons', function(req, res) {
		persons.show(req, res);
	});

	app.get('/new/:name', function(req, res) {
		persons.create(req, res);
	});

	app.get('/remove/:name', function(req, res) {
		persons.delete(req, res);
	});

	app.get('/:name', function(req, res) {
		persons.view(req, res);
	})
}