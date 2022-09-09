var mongoose = require('mongoose'),
	fs		 = require('fs');

mongoose.connect('mongodb://localhost/Full_Mean_Friends');

var models_path = __dirname + '/./../models';

fs.readdirSync(models_path).forEach(function(file) {
	if (file.indexOf('.js') > 0) {
		require(models_path + '/' + file);
	}
});
