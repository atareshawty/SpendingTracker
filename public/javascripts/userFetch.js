var href = document.URL;
var username = href.substring(href.lastIndexOf('/') + 1);
var result = fetch('/api/users/' + username, {
  credentials: 'same-origin'
});
result.then(function(response) {
  return response.json();
}).then(function(user) {
  user.total = user.total.toFixed(2);
  var userTemplate = $('#user-template').html();
  var handleBarsTemplate = Handlebars.compile(userTemplate);
  var compiledHTML = handleBarsTemplate(user);
  $('.user-content-placeholder').html(compiledHTML);
  buildChart(user.spending);
  validateCategories();
  validateAndCreateDateRange();
  validateAndCreatePurchaseInput();
}).catch(function(err) {
  console.log('failed', err);
});
