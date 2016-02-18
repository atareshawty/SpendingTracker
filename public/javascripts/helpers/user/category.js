/* global fetch */
/* global App */
/* global $ */
var Categories = (function() {
  var categoryInput;
  var categorySubmitButton;
  var categoryDropDown;
   
  return {
    startCategoryFormListener: function() {
      categoryInput = $('.category-form #customCategory');
      categorySubmitButton = $('.category-form #submitCategory');
      categoryDropDown = $('#POST-category');
      categoryInput.on('keyup', validateNewCategory);
      categorySubmitButton.on('click', addNewCategory);
    }
  };
  
  function validateNewCategory() {
    var category = categoryInput.val();
    if (0 < category.length && category.length <= 20) {
      categorySubmitButton.attr("disabled", false);
      return true;
    } else {
      categorySubmitButton.attr("disabled", true);
      return false;
    }  
  }

  function addNewCategory() {
    if (validateNewCategory() && !checkForDuplicateCategory()) {
      var category = categoryInput.val();
      sendNewCategoryWithFetch(category);
      App.addUserCategory(category);
      categoryDropDown.append($('<option>', {value: category, text: category}));
    } else if (!validateNewCategory()) {
      alert('The length of your new category should be <= 20');
    } else if (checkForDuplicateCategory()) {
      alert('That category already exists');
    }
    clearNewCategory();
    $('html, body').animate({ scrollTop: 0 }, 'medium');
  }

  function checkForDuplicateCategory() {
    var category = categoryInput.val();
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
    categorySubmitButton.attr("disabled", true);
    categoryInput.val('')
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
}());
