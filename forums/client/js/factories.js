app.factory('userFactory', function($http) {
	var factory = {};

	factory.isLoggedIn = function(callback) {
		$http.get('/self').then(function(res) {
			callback(res.data);
		});
	}

	factory.attemptLogin = function(info, callback) {
		$http.post('/login', info).then(function(res) {
			callback();
		});
	}

	factory.attemptRegister = function(info, callback) {
		$http.post('/register', info).then(function(res) {
			callback();
		});
	}

	factory.logout = function(callback) {
		$http.post('/logout').then(function(res) {
			callback();
		});
	}

	factory.getUser = function(id, callback) {
		$http.get('/users/' + id).then(function(res) {
			callback(res.data);
		});
	}

	factory.postComment = function(id, comment, callback) {
		$http.post('/users/' + id, {comment: comment}).then(function(res) {
			callback(res.data);
		});
	}

	return factory;
});

app.factory('threadFactory', function($http) {
	var factory = {};

	factory.getRecentActivities = function(callback) {
		$http.get('/recent').then(function(res) {
			callback(res.data);
		});
	}

	factory.getThread = function(id, callback) {
		$http.get('/threads/' + id).then(function(res) {
			callback(res.data);
		});
	}

	factory.getLastestAnnouncement = function(callback) {
		$http.get('/announcement').then(function(res) {
			callback(res.data);
		});
	}

	factory.getAllThreads = function(info, callback) {
		$http.post('/threads', info).then(function(res) {
			callback(res.data);
		});
	}

	factory.createThread = function(info, callback) {
		console.log('Passed info: ' + info);
		
		$http.post('/threads/new', info).then(function(res) {
			console.log("DATA:" + res.data);
			callback(res.data);
		});
	}

	factory.postReply = function(id, info, callback) {
		$http.post('/threads/' + id, info).then(function(res) {
			callback(res.data);
		});
	}

	return factory;
});