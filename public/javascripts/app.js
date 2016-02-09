/* global numeral */
var App = (function() {
  'use strict';
  var user = {};
  var filteredSpending = [];
  var formattedFilteredSpendingTotal = '$0.00';
  var unformattedFilteredSpendingTotal = 0;
  var moneyFormatString = '$0,0.00';
  
  return {
    getUser: function() {
      return user;
    },

    getUserSpending: function() {
      return user.spending;
    },

    getUsername: function() {
      return user.username;
    },

    getUserCategories: function() {
      return user.categories;
    },

    getFilteredSpending: function(minDate, maxDate) {
      var begin = 0, end = user.spending.length - 1;
      while ( begin < user.spending.length && user.spending[begin].date.localeCompare(minDate) < 0) {
        begin++;
      }
      while ( end >= 0 && user.spending[end].date.localeCompare(maxDate) > 0 ) {
        end--;
      }
      if (begin <= end) {
        filteredSpending =  user.spending.slice(begin, end + 1);
      } else if (begin > end){
        filteredSpending = [];
      } else {
        filteredSpending = user.spending;
      }
      return filteredSpending;
    },

    getFilteredSpendingTotal: function() {
      if (user.spending.length === filteredSpending.length) {
        return user.formattedTotal;
      } else {
        unformattedFilteredSpendingTotal = 0;
        filteredSpending.forEach(function(value) {
          unformattedFilteredSpendingTotal += value.cost;
        });
        formattedFilteredSpendingTotal = numeral(unformattedFilteredSpendingTotal / 100).format(moneyFormatString);
        return formattedFilteredSpendingTotal;
      }
    },

    getUserId: function() {
      return user.id;
    },

    getUserTotalSpending: function() {
      return user.total;
    },

    setUser: function(newUser) {
      user = newUser;
      user.filteredTotal = numeral(user.total / 100).format(moneyFormatString);
      user.spending.forEach(function(value) {
        value.formattedCost = numeral(value.cost / 100).format(moneyFormatString);
      });
      filteredSpending = user.spending;
      user.formattedTotal = numeral(user.total / 100).format(moneyFormatString);
    },

    addUserCategory: function(category) {
      user.categories.push(category);
    },

    addUserPurchase: function(purchase) {
      user.total += purchase.cost;
      purchase.formattedCost = numeral(purchase.cost / 100).format(moneyFormatString);
      var newPurchaseIndex = 0;
      while ( newPurchaseIndex < user.spending.length && user.spending[newPurchaseIndex].date.localeCompare(purchase.date) < 0) {
        newPurchaseIndex++;
      }
      user.spending.splice(newPurchaseIndex, 0, purchase);
      user.formattedTotal = numeral(user.total / 100).format(moneyFormatString);
    },

    removeUserPurchase: function(indexToRemove) {
      user.total -= user.spending[indexToRemove].cost;
      user.formattedTotal = numeral(user.total / 100).format(moneyFormatString);
      user.spending.splice(indexToRemove, 1);
    },

    buildPieChart: function(spending) {
      spending = spending || user.spending;
      if (spending.length == 0) {
        removeSpendingTable();
        replaceChartWithBlankSlate();
      } else {
        $('.chart-container').html('<canvas class="chart"></canvas>');
        var canvas = $('.chart-container .chart');
        canvas.replaceWith($('<canvas/>', {class: 'chart'}));
        var context = $('.chart').get(0).getContext('2d');
        var chartData = [];
        var purchaseMap = buildPurchasesMapFromSpending(spending);
        //chartData object determined by pie chart from Chart.js
        purchaseMap.forEach(function(value, key, map) {
          chartData.push({
            value: (value / 100).toFixed(2),
            color: randomColor(),
            highlight: '#FF5A5E',
            label: key
          });
        });
        return new Chart(context).Pie(chartData);
      }
    },

    buildTable: function(filteredSpending, filteredTotal) {
      var spending = filteredSpending || user.spending;
      var total = (filteredTotal || user.formattedTotal);
      if (spending.length > 0) {
        var newHTML = Handlebars.templates['spending_table_template']({spending: spending, total: total});
        $('.spending-table-placeholder').html(newHTML);
      } else {
        removeSpendingTable();
      }
    }
  }

  function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function buildPurchasesMapFromSpending(spending) {
    var uniquePurchases = new Map();
    spending.forEach(function(value, index, array) {
      if (uniquePurchases.has(value.category)) {
        var oldValue = uniquePurchases.get(value.category);
        var newValue = oldValue + value.cost;
        uniquePurchases.set(value.category, newValue);
      } else {
        uniquePurchases.set(value.category, value.cost);
      }
    });
    return uniquePurchases;
  }

  function replaceChartWithBlankSlate() {
    var blankSlate = '<h2 class="blankslate">' + 'Looks like you haven\'t added any spending yet</h2>'
    $('.chart-container').html(blankSlate);
  }

  function removeSpendingTable() {
    $('.spending-table-placeholder').html('');
  }
}());
