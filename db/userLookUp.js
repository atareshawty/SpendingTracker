var pg = require('pg');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

function User(id, username, password, spending, total) {
  this.id = id;
  this.username = username;
  this.password = password;
  this.spending = spending;
  this.total = total;
}

function Transaction(cost, category, location, date) {
  this.cost = cost;
  this.category = category;
  this.location = location;
  this.date = date;
}

function createUserObj(id, username, password, callback) {
  var client = createDBClient();
  var query = client.query('SELECT * FROM spending WHERE id = $1', [id]);
  var spending = [];
  var total = 0;

  query.on('error', function(error) {
      callback(error);
  });

  query.on('row', function(row) {
    total += row.cost;
    var date = row.date;
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    var user = new User(id, username, password, spending, total);
    callback(null, user);
  });
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

exports.getUserFilterDate = function(id, minDate, maxDate, done) {
  var client = createDBClient();
  var queryString = 'SELECT * FROM spending WHERE id = $1 AND date BETWEEN $2 and $3';
  var query = client.query(queryString, [id, minDate, maxDate]);
  var total = 0;
  var spending = [];

  query.on('error', function(error) {
    done(error);
  });

  query.on('row', function(row) {
    total += row.cost;
    var date = row.date;
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    done(null, spending, total);
  });
}
