var teams = require('../controllers/teams.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		teams.index(req, res);
	});
};