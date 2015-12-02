function User(id, username, spending, categories) {
  this.id = id;
  this.username = username;
  this.spending = spending;
  this.categories = categories;
  this.totalCost = getTotalCost(spending);
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

function getTotalCost(spending) {
  var total = 0;
  spending.forEach(function(value) {
    total += value.cost;
  });
  total = parseFloat(total.toFixed(2));
  return total;
}
module.exports = User;
