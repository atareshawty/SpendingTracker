$(document).ready(function() {
  createSpendingDate();
  var moneyRegex = /^-?\d+(\.\d{2})?$/;
  var dateRegex = /^\d{4}[-]\d{2}[-]\d{2}$/;

  $('#POST-cost, #POST-location, #POST-date').on('keyup', function() {
    var cost = $('#inputForm input[name=cost]').val();
    var location = $('#inputForm input[name=location]').val();
    var date = $('#POST-date').val();
    
    if (0 < location.length && location.length <= 20 && moneyRegex.test(cost) && dateRegex.test(date)) {
      $("input[id=submitData]").attr("disabled", false);
    } else {
      $("input[id=submitData]").attr("disabled", true);
    }
  });
  
  $('#POST-date').change(function() {
    var cost = $('#inputForm input[name=cost]').val();
    var location = $('#inputForm input[name=location]').val();
    var date = $('#POST-date').val();
    
    if (0 < location.length && location.length <= 20 && moneyRegex.test(cost) && dateRegex.test(date)) {
      $("input[id=submitData]").attr("disabled", false);
    } else {
      $("input[id=submitData]").attr("disabled", true);
    }    
  });
  
});

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