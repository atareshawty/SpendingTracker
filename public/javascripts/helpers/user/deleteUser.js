/* global $ */
$(document).ready(function() {
	$('.btn-danger').on('click', function() {
		$('.overlay').css('visibility', 'visible');
		$('#confirm-name').focus();
		confirmDelete();
	});
	
	$('#close').on('click', function() {
		$('.overlay').css('visibility', 'hidden');
		$('#confirm-name').val('');
		$('#confirm-delete').attr('disabled', true);
	});
	
	$('#confirm-delete').on('click', function() {
		$.ajax({
			url: window.location.href,
			type: 'DELETE'	
		});
	});
});

function confirmDelete() {
	var text = $('#confirm-name');
	text.on('keyup', function() {
		var welcomeText = $('#user-welcome').text();
		var user = welcomeText.split(' ')[1];
		user = user.substr(0, user.length - 1);
		
		if (text.val() == user) {
			$('#confirm-delete').attr('disabled', false);
		} else {
			$('#confirm-delete').attr('disabled', true);
		}
	});	
}
