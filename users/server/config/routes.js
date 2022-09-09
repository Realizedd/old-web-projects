var directives = require('../controllers/users.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		directives.index(req, res);
	});
};