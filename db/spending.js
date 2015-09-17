var pg = require('pg');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

function Transaction(cost, category, location, date) {
  this.cost = cost;
  this.category = category;
  this.location = location;
  this.date = date;
}

exports.createTransaction = function(cost, category, location, date) {
  return new Transaction(cost, category, location, date);
}

exports.insertTransaction = function(id, transaction, date, done) {
  var client = createDBClient();
  var queryString = 'INSERT INTO spending VALUES($1, $2, $3, $4, $5)';
  var query = client.query(queryString,[id, transaction.cost, transaction.category, transaction.location, date]);
  query.on('end', function(row) {
    client.end();
    done();
  });
}
