$(document).ready(function() {
	validateLogging();
	createDateRange();
	createSpendingDate();
	validateDate();
	validateCategories();
	$('#POST-name, #POST-location, #POST-date').change(validateLogging);
	$('#from, #to').change(validateDate);
	$('#customCategory').change(validateCategories);
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

function validateLogging() {
	var cost = $('#inputForm input[name=cost]').val();
	var location = $('#inputForm input[name=location]').val();
	var date = $('#POST-date').val();

	if (cost.length > 0 && location.length > 0 && date.length > 0) {
		$("input[id=submitData]").attr("disabled", false);
	} else {
		$("input[id=submitData]").attr("disabled", true);
	}
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

function validateCategories() {
	var category = $('#customCategory').val();
	if (category.length > 0) {
		$("input[id=submitCategory]").attr("disabled", false);
	} else {
		$("input[id=submitCategory]").attr("disabled", true);
	}
}

