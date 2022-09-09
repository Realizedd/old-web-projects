var products = require('../controllers/products.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		products.index(req, res);
	});
};