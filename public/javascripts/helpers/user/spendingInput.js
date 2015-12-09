$(document).ready(function() {
	createSpendingDate();
	$('#POST-date, #POST-name, #POST-location, #POST-cost').on('keyup', validateFields);
	$('#POST-date').on('change', validateFields);
});

function validateFields() {
	var location = $('#POST-location');
	var date = $('#POST-date');
	var cost = $('#POST-cost');
	if (cost.val().length > 0 && location.val().length > 0 && date.val().length > 0) {
			$("input[id=submitData]").attr("disabled", false);
	} else {
			$("input[id=submitData]").attr("disabled", true);
	}	
}

function createSpendingDate() {
	$('#POST-date').datepicker({
		defaultDate: "+0",
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: "yy-mm-dd",
		altFormat: "yy-mm-dd",
		onClose: function(selectedDate) {
			$('#from').datepicker("option", "maxDate", selectedDate)
		}
	});
}