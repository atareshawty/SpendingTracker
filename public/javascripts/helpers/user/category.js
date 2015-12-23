$(document).ready(function() {
  $('#customCategory').on('keyup', function() {
    var category = $('#customCategory').val();
    if (0 < category.length && category.length <= 20) {
      $("input[id=submitCategory]").attr("disabled", false);
    } else {
      $("input[id=submitCategory]").attr("disabled", true);
    }
  });
});