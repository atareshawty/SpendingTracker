function validateAndCreateDateRange() {
  createDateRange();
  $('#from, #to').change(validateDateRange);
  $('#from, #to').on('keyup', validateDateRange);
}

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

function validateDateRange() {
  var regex = /^\d{4}[-]\d{2}[-]\d{2}$/;
  var minDate = $('#from').val();
  var maxDate = $('#to').val();
  if (regex.test(minDate) && regex.test(maxDate)) {
    $("input[id=submitDate]").attr("disabled", false);
  } else {
    $("input[id=submitDate]").attr("disabled", true);
  }
}