var lions = require('../controllers/lions.js');

module.exports = function(app) {
		// Displays all lions
	app.get('/', function(req, res) {
		lions.show(req, res);
	});

		// Displays the 'create new lion' page
	app.get('/lions/new', function(req, res) {
		lions.new(req, res);
	});

		// Displays info about a specific lion
	app.get('/lions/:id/show', function(req, res) {
		lions.show_one(req, res);
	});

		// Sent when client creates a new lion via /lions/new
	app.post('/lions', function(req, res) {
		lions.save(req, res);
	});

		// Displays the 'edit lion' page
	app.get('/lions/:id/edit', function(req, res) {
		lions.edit(req, res);
	});

		// Sent when client finishes editing a lion via /lions/:id/edit, used to update a lion
	app.post('/lions/:id', function(req, res) {
		lions.update(req, res);
	});

		// Sent when client decides to delete the lion on the edit page
	app.post('/lions/:id/destroy', function(req, res) {
		lions.destroy(req, res);
	});
}