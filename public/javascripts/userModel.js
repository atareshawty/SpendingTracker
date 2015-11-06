function User(id, username, password, spending) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.spending = spending;
}

User.prototype.getId = function() {
  return this.id;
};

User.prototype.getUsername = function() {
  return this.username;
};

User.prototype.getSpending = function() {
  return this.spending;
}

User.prototype.getTotalSpending = function() {
  var total = 0;
  spending.forEach(function(element, index, array) {
    total += element;
  });
  return total;
}

module.exports = User;
