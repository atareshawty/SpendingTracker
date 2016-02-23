/* global $ */
/* global App */
window.Purchases = (function() {
  var cost, location, category, date, submitButton;
  
  return {
    init: function() {
      cost = $('#POST-cost');
      location = $('#POST-location');
      category = $('#POST-category');
      date = $('#POST-date');
      submitButton = $('input[id=submitData]');
      createSpendingDate();
      cost.on('keyup', validatePurchase);
      location.on('keyup', validatePurchase);
      category.on('keyup', validatePurchase);
      date.on('keyup', validatePurchase);
      date.on('change', validatePurchase);
      submitButton.on('click', sendAndInsertNewPurchase);
      $('body').on('click', '.purchase-delete-button', deletePurchase);
      $('body').on('click', '.income-delete-button', deleteIncome);
    }
  };
  
  function createSpendingDate() {
    date.datepicker({
      defaultDate: '+0',
      changeMonth: true,
      numberOfMonths: 1,
      dateFormat: 'yy-mm-dd',
      altFormat: 'yy-mm-dd',
      onClose: function(selectedDate) {
        $('#from').datepicker('option', 'maxDate', selectedDate);
      }
    });
  }

  function validatePurchase() {  
    var moneyRegex = /^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/;
    var dateRegex = /^\d{4}[-]\d{2}[-]\d{2}$/;
    var cost = $('.purchase-form #POST-cost').val();
    var location = $('.purchase-form #POST-location').val();
    var date = $('.purchase-form #POST-date').val();

    if (0 < location.length && location.length <= 20 && moneyRegex.test(cost) && dateRegex.test(date)) {
      submitButton.attr('disabled', false);
      return true;
    } else {
      submitButton.attr('disabled', true);
      return false;
    }
  }

  function sendAndInsertNewPurchase() {
    if (validatePurchase()) {
      var href = document.URL;
      var username = href.substring(href.lastIndexOf('/') + 1);
      var sendCost = cost.val();
      sendCost = sendCost.slice(0, sendCost.length - 3) + sendCost.slice(sendCost.length - 2);
      var purchase = {
        cost: parseInt(sendCost),
        location: location.val(),
        category: category.val(),
        date: date.val()
      };
      var url = '/api/spending/' + username + '/?cost=' + purchase.cost 
                + '&location=' + purchase.location + '&category=' + purchase.category
                + '&date=' + purchase.date;
      fetch(url,  {
        credentials: 'same-origin',
        method: 'post'
      });
      if (purchase.category != 'Income') {
        App.addUserPurchase(purchase);    
        App.buildTable();
        App.buildPieChart();
      } else {
        App.addUserIncome(purchase);
        App.buildIncomeTable();
      }

      App.buildCompareChart();
      clearPurchaseForm();
      $('html, body').animate({ scrollTop: 0 }, 'medium');
    } else {
      clearPurchaseForm();
      $('html, body').animate({ scrollTop: 0 }, 'medium');
      alert('Invalid Purchase Information!');
    }
  }

  function deletePurchase() {
    //Get row number of button being clicked and remove it client side
    var rowIndex = parseInt($(this)[0].id);
    var costColumnNo = rowIndex + (rowIndex * 4);
    var costQueryString = 'td:eq(' + costColumnNo + ')';
    var categoryQueryString = 'td:eq(' + (costColumnNo + 1) + ')';
    var locationQueryString = 'td:eq(' + (costColumnNo + 2) + ')';
    var dateQueryString = 'td:eq(' + (costColumnNo + 3) + ')';
    var sendCost = $(costQueryString).text();
    sendCost = sendCost.split(/[$.,]+/).join('');
    var purchaseToDelete = {
      cost: sendCost,
      category: $(categoryQueryString).text(),
      location: $(locationQueryString).text(),
      date: $(dateQueryString).text()
    };
    console.log('purchase to delete', purchaseToDelete);
    App.removeUserPurchase(rowIndex);
    App.buildPieChart();
    App.buildTable();
    App.buildIncomeTable();
    App.buildCompareChart();
    sendDeletePurchaseFetch(purchaseToDelete);
    $('html, body').animate({ scrollTop: 0 }, 'medium');
  }

  function deleteIncome() {
    //Get row number of button being clicked and remove it client side
    var rowIndex = parseInt($(this)[0].id);
    var incomeRowIndex = rowIndex + App.getUserSpending().length;
    var costColumnNo = incomeRowIndex + (incomeRowIndex * 4);
    var costQueryString = 'td:eq(' + costColumnNo + ')';
    var categoryQueryString = 'td:eq(' + (costColumnNo + 1) + ')';
    var locationQueryString = 'td:eq(' + (costColumnNo + 2) + ')';
    var dateQueryString = 'td:eq(' + (costColumnNo + 3) + ')';
    var sendCost = $(costQueryString).text();
    sendCost = sendCost.split(/[$.,]+/).join('');
    var purchaseToDelete = {
      cost: sendCost,
      category: $(categoryQueryString).text(),
      location: $(locationQueryString).text(),
      date: $(dateQueryString).text()
    };
    console.log('purchase to delete', purchaseToDelete);
    App.removeUserIncome(rowIndex);
    App.buildIncomeTable();
    App.buildCompareChart();
    sendDeletePurchaseFetch(purchaseToDelete);
    $('html, body').animate({ scrollTop: 0 }, 'medium');
  }

  function sendDeletePurchaseFetch(purchase) {
    var href = document.URL;
    var username = href.substring(href.lastIndexOf('/') + 1);
    var url = '/api/spending/' + username + '/?cost=' + purchase.cost 
            + '&location=' + purchase.location + '&category=' + purchase.category
            + '&date=' + purchase.date;
    fetch(url, {
      credentials: 'same-origin',
      method: 'delete'
    });
  }
  function clearPurchaseForm() {
    cost.val('');
    location.val('');
    date.val('');
    submitButton.attr('disabled', true);
  }  
}());
