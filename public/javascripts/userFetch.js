/* global Handlebars */
var href = document.URL;
var username = href.substring(href.lastIndexOf('/') + 1);
var result = fetch('/api/users/' + username, {
  credentials: 'same-origin'
});
result.then(function(response) {
  return response.json();
}).then(function(user) {
  App.setUser(user);
  var userTemplate = Handlebars.templates['user_template'];
  var compiledHTML = userTemplate(App.getUser());
  $('.user-content-placeholder').html(compiledHTML);
  App.buildPieChart();
  App.buildTable();
  App.buildIncomeTable();
  App.buildCompareChart();
  Categories.startCategoryFormListener();
  validateAndCreateDateRange();
  validateAndCreatePurchaseInput();
}).catch(function(err) {
  console.log('failed', err);
});
