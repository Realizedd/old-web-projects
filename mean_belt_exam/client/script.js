var app = angular.module('mean_belt_exam', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider

	.when('/index', {
		templateUrl: '/partials/login.html'
	})

	.when('/', {
		templateUrl: '/partials/dashboard.html'
	})

	.when('/new_question', {
		templateUrl: '/partials/new_question.html'
	})

	.when('/question/:id', {
		templateUrl: '/partials/show.html'
	})

	.when('/question/:id/new_answer', {
		templateUrl: '/partials/new_answer.html'
	})

	.otherwise({
		redirectTo: '/'
	});
});

app.factory('UserFactory', function($http) {
	var factory = {};

	factory.current = function(callback) {
		$http.get('/users').then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res.data);
			}
		});
	}

	factory.login = function(info, callback) {
		$http.post('/users', info).then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
					alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res);
			}
		});
	}

	factory.logout = function(callback) {
		$http.delete('/users/').then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
					alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res);
			}
		})
	}

	return factory;
});

app.factory('QuestionFactory', function($http) {
	var factory = {};
	var questions = [];

	factory.index = function(callback) {
		$http.get('/questions').then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				questions = res.data;
				callback(questions);
			}
		});
	}

	factory.create = function(question, callback) {
		$http.post('/questions', question).then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res);
			}
		});
	}

	factory.get = function(id, callback) {
		$http.get('/questions/' + id).then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res.data);
			}
		});
	}

	factory.create_answer = function(id, answer, callback) {
		$http.post('/questions/' + id, answer).then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res.data);
			}
		});
	}

	factory.add_like = function(answer, callback) {
		$http.post('/answers/' + answer._id).then(function(res) {
			if (typeof(res.data.errors) != 'undefined') {
				alert(res.data.errors[Object.keys(res.data.errors)[0]].message);
			} else {
				callback(res.data);
			}
		});
	}

	return factory;
});

app.controller('UsersController', function($scope, $location, UserFactory) {
	if (document.cookie) {
		$location.url('/');
		return;
	}

	$scope.login = function() {
		var info = $scope.info;
		// Client side validation
		if (!info || !info.name || info.name == '') {
			alert('Name cannot be empty.');
			return;
		} else if (!info.name.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
			alert('Name must be alphabetic.');
			return;
		}

		UserFactory.login($scope.info, function(res) {
			$scope.info = {};
			$location.url('/');
		});
	}
});

app.controller('DashboardController', function($scope, $location, UserFactory, QuestionFactory) {
	if (!document.cookie) {
		$location.url('/index');
		return;
	}

	UserFactory.current(function(data) {
		$scope.user = data;
	});

	$scope.questions = [];

	QuestionFactory.index(function(data) {
		$scope.questions = data;
	});

	$scope.logout = function() {
		UserFactory.logout(function(data) {
			$location.url('/index');
		});
	}
});

app.controller('QuestionsController', function($scope, $location, UserFactory, QuestionFactory) {
	$scope.add_question = function() {
		var new_question = $scope.new_question;

		// Client side validation
		if (!new_question || !new_question.message) {
			alert('Please type a valid message.');
			return;
		} else if (new_question.message.length < 10) {
			alert('Messages must be at least 10 characters long.');
			return;
		}

		QuestionFactory.create($scope.new_question, function(data) {
			$scope.new_question = {};
			$location.url('/');
		});
	}

	$scope.logout = function() {
		UserFactory.logout(function(data) {
			$location.url('/index');
		});
	}
});

app.controller('ViewController', function($scope, $location, $routeParams, UserFactory, QuestionFactory) {
	$scope.question = {};

	QuestionFactory.get($routeParams.id, function(data) {
		$scope.question = data;

		if (!$scope.question) {
			$location.url('/');
			return;
		}
	});

	$scope.add_like = function(answer) {
		QuestionFactory.add_like(answer, function(data) {
			answer.likes = data.likes;
		});
	}

	$scope.logout = function() {
		UserFactory.logout(function(data) {
			$location.url('/index');
		});
	}
});

app.controller('AnswersController', function($scope, $location, $routeParams, UserFactory, QuestionFactory) {
	$scope.question = {};

	QuestionFactory.get($routeParams.id, function(data) {
		$scope.question = data;

		if (!$scope.question) {
			$location.url('/');
			return;
		}
	});

	$scope.add_answer = function() {
		var new_answer = $scope.new_answer;

		// More client side validation
		if (!new_answer || !new_answer.message) {
			alert('Please type a valid answer.');
			return;
		} else if (new_answer.message.length < 5) {
			alert('Answers must be at least 5 characters long.');
			return;
		}

		QuestionFactory.create_answer($scope.question._id, $scope.new_answer, function(data) {
			$scope.new_answer = {};
			$location.url('/');
		});
	}

	$scope.logout = function() {
		UserFactory.logout(function(data) {
			$location.url('/index');
		});
	}
});