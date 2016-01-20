var App = (function() {
  'use strict';
  var user = {};
  
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
      // var begin = 0, end = user.spending.length;
      // while (user.spending[begin] < minDate) {
      //   begin++;
      // }
      // while (user.spending[end] > maxDate) {
      //   end--;
      // }
      // if (begin <= end) {
      //   return user.spending.slice(begin, ++end);  
      // } else {
      //   return user.spending;
      // }
    },
    
    getUserId: function() {
      return user.id;
    },
    
    setUser: function(newUser) {
      user = newUser;
    },
    
    addUserCategory: function(category) {
      user.categories.push(category);
    },
    
    addUserPurchase: function(purchase) {
      //We'll add to this later
    }
  }
}());