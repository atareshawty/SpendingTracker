/* global $ */
$(document).ready(function() {
	var username = $('#inputForm input[name=username]');
	var password = $('#inputForm input[name=password]');
	$('#inputForm input[name=username], #inputForm input[name=password]').on('keyup', function() {
		if (username.val().length > 0 && password.val().length > 0) {
			$("input[type=submit]").attr("disabled", false);
		} else {
			$("input[type=submit]").attr("disabled", true);
		}      
	});
});