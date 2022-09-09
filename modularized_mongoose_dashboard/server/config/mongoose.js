var mongoose = require('mongoose'),
	fs 		 = require('fs'),
	path 	 = require('path');

// Mongoose handling <

mongoose.connect('mongodb://localhost/new_test_db');

var models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file) {
	if (file.indexOf('.js') >= 0) {
		require(models_path + '/' + file);
	}
});

// Mongoose handling >