function validateAndCreateDateRange() {
  createDateRange();
  $('#from, #to').change(validateDateRange);
  $('#from, #to').on('keyup', validateDateRange);
  $('#submitDate').on('click', getInfoBetweenDates);
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

function getInfoBetweenDates() {
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
  var income = App.getFilteredIncome(minDate, maxDate);
  var spendingTotal = App.getFilteredSpendingTotal();
  var incomeTotal = App.getFilteredIncomeTotal();
  App.buildPieChart(spending)
  App.buildTable(spending, spendingTotal);
  App.buildCompareChart(incomeTotal, spendingTotal);
  App.buildIncomeTable(income, incomeTotal);
  $('html, body').animate({ scrollTop: 0 }, 'medium');
}