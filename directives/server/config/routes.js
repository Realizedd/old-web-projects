var directives = require('../controllers/directives.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		directives.index(req, res);
	});
};