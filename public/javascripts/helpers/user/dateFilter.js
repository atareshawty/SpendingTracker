$(document).ready(function() {
  createDateRange();
  var regex = /^\d{4}[-]\d{2}[-]\d{2}$/;
  
  $('#from, #to').change(function() {
    var minDate = $('#from').val();
    var maxDate = $('#to').val();
    if (regex.test(minDate) && regex.test(maxDate)) {
      $("input[id=submitDate]").attr("disabled", false);
    } else {
      $("input[id=submitDate]").attr("disabled", true);
    }
  });
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