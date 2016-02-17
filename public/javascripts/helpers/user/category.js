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
  if (validateNewCategory() && !checkForDuplicateCategory()) {
    var category = $('.category-form #customCategory').val();
    sendNewCategoryWithFetch(category);
    App.addUserCategory(category);
    $('#POST-category').append($('<option>', {value: category, text: category}));
  } else if (!validateNewCategory()) {
    alert('The length of your new category should be <= 20');
  } else if (checkForDuplicateCategory()) {
    alert('That category already exists');
  }
  clearNewCategory();
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function checkForDuplicateCategory() {
  var category = $('.category-form #customCategory').val();
  var hasDuplicate = false;
  $("select[name='category'] > option").each(function () {
    if (category.toLowerCase() === this.text.toLowerCase()) {
      hasDuplicate = true;
      //break out of loop
      return false;
    }
  });
  return hasDuplicate; 
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