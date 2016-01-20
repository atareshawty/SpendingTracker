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
    fetchAndReplaceSpending($('#from').val(), $('#to').val());
  } else {
    alert('Invalid date format!');    
  }
  $("input[id=submitDate]").attr("disabled", true);
  $('#from').text('');
  $('#to').text('');
}

function fetchAndReplaceSpending(minDate, maxDate) {
  var href = document.URL;
  var username = href.substring(href.lastIndexOf('/') + 1);
  var url = '/api/spending/' + username  + '?from=' + minDate  + '&to=' + maxDate;
  console.log(url);
  var result = fetch(url, {
    credentials: 'same-origin'
  });
  result.then(function(response) {
    return response.json();
  }).then(function(spending) {
    var userTemplate = Handlebars.templates['spending_table_template'];
    var compiledHTML = userTemplate(spending);
    $('.spending-table-placeholder').html(compiledHTML);
  }).catch(function(err) {
    console.log('failed', err);
  });
}