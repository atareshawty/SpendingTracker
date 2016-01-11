/* global $ */
/* global Handlebars */
$('document').ready(function() {
  var href = document.URL;
  var username = href.substring(href.lastIndexOf('/') + 1);
  var result = fetch('/api/users/' + username, {
    credentials: 'same-origin'
  });
  result.then(function(response) {
    // console.log('response', response);
    // console.log('header', response.headers.get('Content-Type'));
    return response.json();
  }).then(function(text) {
    var userTemplate = $('#user-template').html();
    var handleBarsTemplate = Handlebars.compile(userTemplate);
    var compiledHTML = handleBarsTemplate(text);
    $('.user-content-placeholder').html(compiledHTML);
  }).catch(function(err) {
    console.log('failed', err);
  });
});