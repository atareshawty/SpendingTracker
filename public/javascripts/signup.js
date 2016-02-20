$(document).ready(function() {
  $('input[name=username], input[name=password]').on('keyup', validateSignupForm);
});

function validateSignupForm() {
  var username = $('input[name=username]');
  var password = $('input[name=password]');
  if (username.val().length > 0 && password.val().length > 0 && username.val().length <= 20) {
    $("#signup-submit").attr("disabled", false);
    return true;
  } else {
    $("#signup-submit").attr("disabled", true);
    return false;
  }
}