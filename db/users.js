var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');

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
  console.log('Creating user');
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
};

exports.insertTransaction = function(id, transaction, done) {
  console.log('Inserting transaction');
  var client = createDBClient();
  var queryString = 'INSERT INTO spending VALUES($1, $2, $3, $4, $5)';
  var query = client.query(queryString,[id, transaction.cost, transaction.category, transaction.location, transaction.date]);
  query.on('end', function(row) {
    client.end();
    done();
  });
};

exports.findByUsername = function(username, cb) {
  console.log('Find by username');
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
};

exports.getUserFilterDate = function(id, minDate, maxDate, done) {
  console.log('get user filter date');
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
};

exports.createTransaction = function(cost, category, location, date) {
  return new Transaction(cost, category, location, date);
};

exports.insertUsernameAndPassword = function(username, password, callback) {
  console.log('insert username and password');
  usernameExists(username, function(err, exists) {
    if (err) {callback(err);}

    var client = createDBClient();
    var id = null;
    client.on('error', function(err) {
      callback(err);
    });

    if (!exists) {
      var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      var insertQuery = client.query('INSERT INTO login (username, password) VALUES($1,$2)', [username, hash]);
      insertQuery.on('end', function() {
        var idQuery = client.query('SELECT * FROM login WHERE username = $1', [username]);
        idQuery.on('row', function(row) {
          id = row.id;
        });
        idQuery.on('end', function() {
          client.end();
          callback(null, false, id);
        })
      });
    } else {
      client.end();
      callback(null, true);
    }
  });
};

function usernameExists(username, callback) {
  console.log('username exists');
  var client = createDBClient();

  client.on('error', function(err){
    callback(err);
  });

  var query = client.query('SELECT * FROM login WHERE username = $1', [username]);
  query.on('end', function(result) {
    // client.end();
    callback(null, result.rowCount > 0);
  });
}
