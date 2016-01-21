function validateAndCreateDateRange() {
  createDateRange();
  $('#from, #to').change(validateDateRange);
  $('#from, #to').on('keyup', validateDateRange);
  $('#submitDate').on('click', getSpendingBetweenDates);
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
    return true;
  } else {
    $("input[id=submitDate]").attr("disabled", true);
    return false;
  }
}

function getSpendingBetweenDates() {
  if (validateDateRange) {
    filterAndReplaceSpending($('#from').val(), $('#to').val());
  } else {
    alert('Invalid date format!');    
  }
  $("input[id=submitDate]").attr("disabled", true);
  $('#from').val('');
  $('#to').val('');
}

function filterAndReplaceSpending(minDate, maxDate) {
  var spending = App.getFilteredSpending(minDate, maxDate);
  var total = App.getFilteredSpendingTotal();
  var userTemplate = Handlebars.templates['spending_table_template'];
  var compiledHTML = userTemplate({'spending': spending, 'total': total});
  $('.spending-table-placeholder').html(compiledHTML);
  console.log('Spending', spending);
  App.buildPieChart(spending);
}