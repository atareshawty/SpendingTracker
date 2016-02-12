/* global numeral */
var App = (function() {
  'use strict';
  //user has spending, income, totalSpending, totalIncome, formattedTotalSpending, formattedTotalIncome
  //non user variables are filteredSpending, filteredIncome, formattedFilteredSpendingTotal, formattedFilteredIncomeTotal, filteredSpendingTotal, filteredIncomeTotal
    
  var user = {};
  var moneyFormatString = '$0,0.00';
  var filteredSpending = [];
  var filteredIncome = [];
  var formattedFilteredSpendingTotal = '$0.00';
  var formattedFilteredIncomeTotal = '$0.00';
  var filteredSpendingTotal = 0;
  var filteredIncomeTotal = 0;
  
  return {
    setUser: function(newUser) {
      user.spending = [];
      user.income = [];
      user.totalSpending = 0;
      user.totalIncome = 0;
      user.categories = newUser.categories;
      
      newUser.spending.forEach(function(value) {
        value.formattedCost = numeral(value.cost / 100).format(moneyFormatString);
        if (value.category === 'Income') {
          user.totalIncome += value.cost;
          user.income.push(value);
        } else {
          user.totalSpending += value.cost;
          user.spending.push(value);
        }
      });
      
      filteredSpending = user.spending;
      filteredIncome = user.income;
      user.formattedTotalSpending = numeral(user.totalSpending / 100).format(moneyFormatString);
      user.formattedTotalIncome = numeral(user.totalIncome / 100).format(moneyFormatString);
    },    
    
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
        return user.formattedTotalSpending;
      } else {
        filteredSpendingTotal = 0;
        filteredSpending.forEach(function(value) {
          filteredSpendingTotal += value.cost;
        });
        formattedFilteredSpendingTotal = numeral(filteredSpendingTotal / 100).format(moneyFormatString);
        return formattedFilteredSpendingTotal;
      }
    },

    getUserId: function() {
      return user.id;
    },

    getUserTotalSpending: function() {
      return user.total;
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
      user.formattedTotalSpending = numeral(user.total / 100).format(moneyFormatString);
    },

    removeUserPurchase: function(indexToRemove) {
      user.total -= user.spending[indexToRemove].cost;
      user.formattedTotalSpending = numeral(user.total / 100).format(moneyFormatString);
      user.spending.splice(indexToRemove, 1);
    },

    buildPieChart: function(spending) {
      spending = spending || user.spending;
      if (spending.length == 0) {
        removeSpendingTable();
        replaceSpendingChartWithBlankSlate();
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
      var total = (filteredTotal || user.formattedTotalSpending);
      if (spending.length > 0) {
        var newHTML = Handlebars.templates['spending_table_template']({spending: spending, total: total});
        $('.spending-table-placeholder').html(newHTML);
      } else {
        removeSpendingTable();
      }
    },
    
    buildIncomeTable: function(filteredIncome, filteredTotal) {
      var income = filteredIncome || user.income;
      var total = filteredTotal || user.formattedTotalIncome;
      if (income.length > 0) {
        var newHTML = Handlebars.templates['income_tracker_template']({income: income, total: total});
        $('.income-table-placeholder').html(newHTML);
      }
    },
    
    buildCompareChart: function(incomeTotal, spendingTotal) {
      debugger;
      incomeTotal = incomeTotal || user.totalIncome;
      spendingTotal = spendingTotal || user.totalSpending;
      $('.income-chart-container').html('<canvas class="income-chart"></canvas>');
      var canvas = $('.income-chart-container .income-chart');
      canvas.replaceWith($('<canvas/>', {class: 'income-chart'}));
      var context = $('.income-chart').get(0).getContext('2d');
      var data = {
        labels: ["Compare"],
        datasets: [
            {
              label: "Income",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: [incomeTotal / 100]
            },
            {
              label: "Spending",
              fillColor: "rgba(151,187,205,0.5)",
              strokeColor: "rgba(151,187,205,0.8)",
              highlightFill: "rgba(151,187,205,0.75)",
              highlightStroke: "rgba(151,187,205,1)",
              data: [spendingTotal / 100]
            }
        ]
    };      
      return new Chart(context).Bar(data);
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

  function replaceSpendingChartWithBlankSlate() {
    var blankSlate = '<h2 class="blankslate">' + 'Looks like you haven\'t added any spending yet</h2>'
    $('.chart-container').html(blankSlate);
  }

  function removeSpendingTable() {
    $('.spending-table-placeholder').html('');
  }

  function removeIncomeTable() {
    $('.income-table-placeholder').html('');
  }
}());
