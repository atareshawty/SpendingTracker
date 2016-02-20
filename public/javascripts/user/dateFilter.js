var DateFilter = (function() {
  var fromInput, toInput, submitButton;
  return {
    init: function() {
      fromInput = $('#from');
      toInput = $('#to');
      submitButton = $('#submitDate');
      createDateRange();
      fromInput.change(validateDateRange);
      toInput.change(validateDateRange);
      fromInput.on('keyup', validateDateRange);
      toInput.on('keyup', validateDateRange);
      submitButton.on('click', getInfoBetweenDates);
    }
  };

  function createDateRange() {
    fromInput.datepicker({
      defaultDate: "-1m",
      changeMonth: true,
      numberOfMonths: 1,
      dateFormat: "yy-mm-dd",
      onClose: function(selectedDate) {
        fromInput.datepicker("option", "minDate", selectedDate)
      }
    });

    toInput.datepicker({
      defaultDate: "+0",
      changeMonth: true,
      numberOfMonths: 1,
      dateFormat: "yy-mm-dd",
      onClose: function(selectedDate) {
        toInput.datepicker("option", "maxDate", selectedDate)
      }
    });  
  }

  function validateDateRange() {
    var regex = /^\d{4}[-]\d{2}[-]\d{2}$/;
    var minDate = fromInput.val();
    var maxDate = toInput.val();
    if (regex.test(minDate) && regex.test(maxDate)) {
      submitButton.attr("disabled", false);
      return true;
    } else {
      submitButton.attr("disabled", true);
      return false;
    }
  }

  function getInfoBetweenDates() {
    if (validateDateRange) {
      filterAndReplaceSpending(fromInput.val(), toInput.val());
    } else {
      alert('Invalid date format!');    
    }
    $("input[id=submitDate]").attr("disabled", true);
    fromInput.val('');
    toInput.val('');
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
}());

