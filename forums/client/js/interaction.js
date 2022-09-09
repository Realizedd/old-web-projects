var dropMenuShown = false;

$(document).ready(function() {
	var $injector = angular.element(document.body).injector();

	$('.drop-menu').hide();

	$('.containers').on('click', function(event) {
		if (!dropMenuShown) {
			return;
		}

		$('.drop-menu').slideUp(400, function() {
			dropMenuShown = false;
		});

		$('.containers').css('opacity', '1');
		$('.containers').css('transition', 'opacity 0.3s');
		event.stopProgation();
	});

	$(document.body).on('click', '#menu', function(event) {
		if($('#menu').text().includes('SIGN OUT')) {
			$injector.get('userFactory').logout(function() {
				window.location.reload();
			});
			
			return;
		}

		if (dropMenuShown) {
			return;
		}

		event.preventDefault();

		$('.drop-menu').slideDown(400, function() {
			dropMenuShown = true;
		});

		$('.containers').css('opacity', '0.25');
		$('.containers').css('transition', 'opacity 0.3s');
	});

	$(document.body).on('click', '#side-content-user-info-wrapper button', function(event) {
		if (dropMenuShown) {
			return;
		}

		event.preventDefault();

		$('.drop-menu').slideDown(400, function() {
			console.log('Done');
			dropMenuShown = true;
		});

		$('.containers').css('opacity', '0.25');
		$('.containers').css('transition', 'opacity 0.3s');
	});

	$(document.body).on('click', '.forum-main-content-table-content', function() {
		window.location.href = $(this).attr('link');
	});
});