function User(id, username, spending, categories) {
  this.id = id;
  this.username = username;
  this.spending = spending;
  this.categories = categories;
}

User.prototype.getId = function() {
  return this.id;
};

User.prototype.getUsername = function() {
  return this.username;
};

User.prototype.getSpending = function() {
  return this.spending;
};

User.prototype.getCategories = function() {
  return this.categories;
};

User.prototype.getTotalSpending = function() {
  var total = 0;
  this.spending.forEach(function(element) {
    total += element.cost;
  });
  total *= 100;
  total /= 100;
  return total;
};

module.exports = User;
