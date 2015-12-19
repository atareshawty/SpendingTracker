$(document).ready(function() {
	createDateRange();
	$('#from, #to').change(validateDate);
	
});

function createDateRange() {
	$('#from').datepicker({
		defaultDate: "-1m",
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: "yy-mm-dd",
		onClose: function(selectedDate) {
			$('#from').datepicker("option", "minDate", selectedDate)
		}
	});

	$('#to').datepicker({
		defaultDate: "+0",
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: "yy-mm-dd",
		onClose: function(selectedDate) {
			$('#from').datepicker("option", "maxDate", selectedDate)
		}
	});
}

function validateDate() {
	var minDate = $('#from').val();
	var maxDate = $('#to').val();

	if (minDate.length > 0 && maxDate.length > 0) {
		$("input[id=submitDate]").attr("disabled", false);
	} else {
		$("input[id=submitDate]").attr("disabled", true);
	}
}