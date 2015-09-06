var pg = require('pg');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

function Transaction(cost, category, location) {
  this.cost = cost;
  this.category = category;
  this.location = location;
}

exports.createTransaction = function(cost, category, location) {
  return new Transaction(cost, category, location);
}

exports.insertTransaction = function(id, transaction, done) {
  var client = createDBClient();
  var query = client.query('INSERT INTO spending VALUES($1, $2, $3, $4)',[id, transaction.cost, transaction.category, transaction.location]);
  query.on('end', function(row) {
    client.end();
    done();
  });
}
