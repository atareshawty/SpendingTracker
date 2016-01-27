function validateCategories() {
  $('.category-form #customCategory').on('keyup', validateNewCategory);
  $('.category-form #submitCategory').on('click', addNewCategory);
}

function validateNewCategory() {
  var category = $('.category-form #customCategory').val();
  if (0 < category.length && category.length <= 20) {
    $('.category-form #submitCategory').attr("disabled", false);
    return true;
  } else {
    $('.category-form #submitCategory').attr("disabled", true);
    return false;
  }  
}

function addNewCategory() {
  if (validateNewCategory()) {
    var category = $('.category-form #customCategory').val();
    sendNewCategoryWithFetch(category);
    App.addUserCategory(category);
    $('#POST-category').append($('<option>', {value: category, text: category}));
  } else {
    alert('That was bad!');
  }
  clearNewCategory();
}

function clearNewCategory() {
  $('.category-form #submitCategory').attr("disabled", true);
  $('.category-form #customCategory').val('')
}

function sendNewCategoryWithFetch(category) {
  var href = document.URL;
  var username = href.substring(href.lastIndexOf('/') + 1);
  var url = '/api/category/' + username + '/?category=' + category;
  fetch(url, {
    credentials: 'same-origin',
    method: 'post'
  });
}