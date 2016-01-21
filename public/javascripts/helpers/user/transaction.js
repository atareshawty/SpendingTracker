function validateAndCreatePurchaseInput() {
  createSpendingDate();
  $('#POST-cost, #POST-location, #POST-date').on('keyup', validatePurchase);
  $('#POST-date').change(validatePurchase);
  $('#submitData').on('click', sendAndInsertNewPurchase);
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

function validatePurchase() {  
  var moneyRegex = /^-?\d+(\.\d{2})?$/;
  var dateRegex = /^\d{4}[-]\d{2}[-]\d{2}$/;
  var cost = $('.purchase-form #POST-cost').val();
  var location = $('.purchase-form #POST-location').val();
  var date = $('.purchase-form #POST-date').val();

  if (0 < location.length && location.length <= 20 && moneyRegex.test(cost) && dateRegex.test(date)) {
    $("input[id=submitData]").attr("disabled", false);
    return true;
  } else {
    $("input[id=submitData]").attr("disabled", true);
    return false;
  }
}

function sendAndInsertNewPurchase() {
  if (validatePurchase()) {
    var href = document.URL;
    var username = href.substring(href.lastIndexOf('/') + 1);
    var purchase = {
      cost: parseFloat($('.purchase-form #POST-cost').val()),
      location: $('.purchase-form #POST-location').val(),
      category: $('.purchase-form #POST-category').val(),
      date: $('.purchase-form #POST-date').val()
    }
    var url = '/api/spending/' + username + '/?cost=' + purchase.cost 
              + '&location=' + purchase.location + '&category=' + purchase.category
              + '&date=' + purchase.date;
    console.log(url);
    fetch(url,  {
      credentials: 'same-origin',
      method: 'post'
    });
    App.addUserPurchase(purchase);
    var newSpending = App.getUserSpending();
    var newTotal = App.getUserTotalSpending();
    var newHTML = Handlebars.templates['spending_table_template']({spending: newSpending, total: newTotal});
    $('.spending-table-placeholder').html(newHTML);
    clearPurchaseForm();  
  } else {
    clearPurchaseForm();
    alert('Invalid Purchase Information!');
  }
}

function clearPurchaseForm() {
  $('.purchase-form #POST-cost').val('');
  $('.purchase-form #POST-location').val('');
  $('.purchase-form #POST-date').val('');
  $("input[id=submitData]").attr("disabled", true);
}