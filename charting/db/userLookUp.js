var pg = require('pg');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

function User(id, username, password, spending) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.spending = spending;
}

function Transaction(cost, category, location) {
  this.cost = cost;
  this.category = category;
  this.location = location;
}

function createUser(id, username, password, callback) {
  var client = createDBClient();
  var query = client.query('SELECT * FROM spending WHERE id = $1', [id]);
  var spending = [];
  query.on('row', function(row) {
    spending.push(new Transaction(row.cost, row.category, row.location));
    console.log('Transaction has been added to user.spending');
  });

  query.on('end', function() {
    var user = new User(id, username, password, spending);
    console.log(user.spending);
    callback(null, user);
  })
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    var client = createDBClient();
    var query = client.query('SELECT * FROM login WHERE username = $1',[username]);
    query.on('row', function(row) {
      if (row) {
        createUser(row.id, row.username, row.password, function(err, user) {
            return cb(null, user);
        });
      } else {
        cb(new Error('User ' + username + ' does not exist'));
      }
    });
  });
}

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var client = createDBClient();
    var query = client.query('SELECT * from login WHERE id = $1', [id]);

    query.on('row', function(row) {
      var userRecord = {};
      if (row) {
        createUser(row.id, row.username, row.password, function(err, user) {
          return cb(null, user);
        })
      } else {
        cb(new Error('User ' + id + ' does not exist'));
      }
    });
  });
}
