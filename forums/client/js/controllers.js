app.controller('DropMenuController', function($scope, $location, $window, userFactory) {
	$scope.login = {};

	$scope.attemptLogin = function() {
		userFactory.attemptLogin($scope.login, function() {
			$scope.login = {};
			$window.location.reload();
		});
	}

	$scope.attemptRegister = function() {
		userFactory.attemptRegister($scope.registration, function() {
			$scope.registration = {};
			$window.location.reload();
		});
	}

	// userFactory.isLoggedIn(function(data) {
	// 	if (data.logged_in) {
	// 		// UNUSED: $('.user-info').html('<a href="#/" id="menu"><i class="fa fa-bars fa-lg" aria-hidden="true"></i></a>');
	// 		$('.user-info').html('<a href="#/" id="menu">SIGN OUT <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>');
	// 	} else {
	// 		$('.user-info').html('<a href="#/" id="menu">SIGN IN <i class="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i></a>');
	// 	}
	// });
});

app.controller('HomeController', function($scope, $location, userFactory, threadFactory) {
	$scope.user = {};

	$scope.announcement = {};

	$scope.recent = [];

	threadFactory.getLastestAnnouncement(function(data) {
		var date = new Date(data.creation);
		data.creation = formatDate(date);
		$scope.announcement = data;
	});

	threadFactory.getRecentActivities(function(data) {
		console.log(data);
		$scope.recent = data;
	});

	userFactory.isLoggedIn(function(data) {
		if (data.logged_in) {
			// $('.user-info').html('<a href="#/" id="menu"><i class="fa fa-bars fa-lg" aria-hidden="true"></i></a>');
			$('.user-info').html('<a href="#/" id="menu">SIGN OUT <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>');
			$scope.user.username = data.username;
		} else {
			$('#side-content-user-info-wrapper').html('<p class="important top-cover">Welcome, User</p><button>Sign up now!</button>');
			$('.user-info').html('<a href="#/" id="menu">SIGN IN <i class="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i></a>');
		}
	});

	$scope.format = function(str) {
		return formatDate(new Date(str));
	}
});

app.controller('ProfileController', function($scope, $window, $routeParams, userFactory) {
	$scope.user = {};
	$scope.new_comment = {};

	// userFactory.isLoggedIn(function(data) {
	// 	if (data.logged_in) {
	// 		// UNUSED: $('.user-info').html('<a href="#/" id="menu"><i class="fa fa-bars fa-lg" aria-hidden="true"></i></a>');
	// 		$('.user-info').html('<a href="#/" id="menu">SIGN OUT <i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>');
	// 	} else {
	// 		$('.user-info').html('<a href="#/" id="menu">SIGN IN <i class="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i></a>');
	// 	}
	// });

	userFactory.getUser($routeParams.id, function(user) {
		$scope.user = user;
		var date = new Date($scope.user.created_at);
		$scope.user.created_at = formatDate(date);

		for (var i in user.comments) {
			var comment = user.comments[i];
			var cDate = new Date(comment.comment_creation);
			var dateStr = formatDate(date);
			$('#profile-wall-content-comments').append('<div class="profile-wall-content-comment"><a href="#/members/' + comment.creator_id + '">' + comment.comment_creator + '</a><p>' + comment.comment + '</p><p>' + dateStr + '</p></div>');
		}

		$scope.addComment = function() {
			userFactory.postComment(user.id, $scope.new_comment.comment, function(res) {
				$scope.new_comment = {};
				$window.location.reload();
			});
		}
	});
});

app.controller('ThreadListController', function($scope, $window, $routeParams, userFactory, threadFactory) {
	$scope.threads = [];

	threadFactory.getAllThreads({}, function(threads) {
		if (threads instanceof Array) {
			$scope.threads = threads;
		}
	});

	$scope.updateThreads = function() {
		console.log($('#form-main-content-type').val());

		threadFactory.getAllThreads({creation_date: ($('#form-main-content-type').val() == 'create_time')}, function(threads) {
			console.log(threads);

			if (threads instanceof Array) {
				$scope.threads = threads;
			}
		});
	}
});

app.controller('ThreadCreateController', function($scope, $window, threadFactory) {
	$scope.new_thread = {};

	$scope.createThread = function() {
		console.log('Fired');
		
		threadFactory.createThread($scope.new_thread, function(result) {
			$window.location.href = '#/forum';
			$scope.new_thread = {};
		});
	}
});

app.controller('ThreadViewController', function($scope, $window, $routeParams, threadFactory) {
	$scope.thread = {};
	$scope.replies = [];
	$scope.new_reply = {};

	threadFactory.getThread($routeParams.id, function(data) {
		$scope.thread = data.thread;
		$scope.replies = data.replies;
		console.log(data);
	});

	$scope.postReply = function() {
		threadFactory.postReply($routeParams.id, $scope.new_reply, function(result) {
			$window.location.reload();
			$scope.new_reply = {};
		});
	}

	$scope.format = function(str) {
		// var cDate = new Date(str);
		// var dateStr = monthNames[cDate.getMonth()] + " " + cDate.getDate() + ", " + cDate.getFullYear() + " " + cDate.;
		// return dateStr;
		return formatDate(new Date(str));
	}
});

function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " " + strTime;
}