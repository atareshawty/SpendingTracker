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

function createUserObj(id, username, password, callback) {
  var client = createDBClient();
  var query = client.query('SELECT * FROM spending WHERE id = $1', [id]);
  var spending = [];

  query.on('error', function(error) {
      callback(error);
  });

  query.on('row', function(row) {
    spending.push(new Transaction(row.cost, row.category, row.location));
  });

  query.on('end', function() {
    var user = new User(id, username, password, spending);
    callback(null, user);
  })
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    var client = createDBClient();
    var query = client.query('SELECT * FROM login WHERE username = $1',[username]);

    query.on('error', function(error) {
      cb(error);
    });

    query.on('row', function(row, result) {
      result.addRow(row);
    });

    query.on('end', function(result) {
      if (result.rowCount === 1) {
        var row = result.rows[0];
        createUserObj(row.id, row.username, row.password, function(err, user) {
            if (err) {cb(err);}
            cb(null, user);
        });
      } else {
        cb(null, null);
      }
    });
  });
}
