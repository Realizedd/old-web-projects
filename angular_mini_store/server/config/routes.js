var teams = require('../controllers/stores.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		teams.index(req, res);
	});
};