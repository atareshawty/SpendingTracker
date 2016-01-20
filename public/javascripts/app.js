var App = (function() {
  'use strict';
  var user = {};
  var filteredSpending = [];
  var filteredSpendingTotal = 0;
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
      while (user.spending[begin].date.localeCompare(minDate) < 0 ) {
        begin++;
      }
      while (user.spending[end].date.localeCompare(maxDate) > 0 ) {
        end--;
      }
      if (begin <= end) {
        filteredSpending =  user.spending.slice(begin, ++end);
      } else {
        filteredSpending = user.spending;
      }
      return filteredSpending;
    },
    
    getFilteredSpendingTotal: function() {
      if (user.spending.length === filteredSpending.length) {
        return filteredSpendingTotal;
      } else {
        filteredSpendingTotal = 0;
        filteredSpending.forEach(function(value) {
          filteredSpendingTotal += value.cost;
        });
        filteredSpendingTotal = parseFloat(filteredSpendingTotal.toFixed(2));
        return filteredSpendingTotal;
      }
    },
    
    getUserId: function() {
      return user.id;
    },
    
    setUser: function(newUser) {
      user = newUser;
      filteredSpending = newUser.spending;
      filteredSpendingTotal = newUser.total;
    },
    
    addUserCategory: function(category) {
      user.categories.push(category);
    },
    
    addUserPurchase: function(purchase) {
      //We'll add to this later
    }
  }
}());