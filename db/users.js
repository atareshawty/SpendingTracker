var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');

function createDBClient() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

/**
  Gets all necessary information from db to create user object passed back into callback
  Callback function {@done} expects {@err} and {@user}
  @param id - id for lookup in db
  @param username
  @param password
  @param done - callback
*/
function createUserObj(id, username, password, done) {
  console.log('\nCreating user');
  var client = createDBClient();
  var query = client.query('SELECT * FROM spending WHERE id = $1', [id]);
  var spending = [];

  query.on('error', function(error) {
      done(error);
  });

  query.on('row', function(row) {
    var date = row.date;
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    var user = new User(id, username, password, spending);
    done(null, user);
  });
};

/**
  Inserts transaction {@transaction} into db, for user with id = {@id}
  Callback function {@done} expects {@err}
  @param id - user id
  @param transaction - inserted into db
  @param done - callback function
*/
exports.insertTransaction = function(id, transaction, done) {
  var client = createDBClient();
  var queryString = 'INSERT INTO spending VALUES($1, $2, $3, $4, $5)';
  var query = client.query(queryString,[id, transaction.cost, transaction.category, transaction.location, transaction.date]);
  query.on('error', function(err) {
    client.end();
    done(err);
  })
  query.on('end', function(row) {
    client.end();
    done(null);
  });
};

/**
  Finds user by {@username} and returns user into {@cb} callback function
  Callback params: {@err}, {@user} object
  @param username
  @param cb
*/
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

/**
  Gets all spending info from user {@id} between {@minDate} and {@maxDate}
  Callback params are {@err} and {@spending} which is an array of transactions
  @param id - id of user for which information is requested
  @param minDate - minimum date for which information is requested
  @param maxDate - maximum date for which information is requested
  @param callback function
*/
exports.getUserFilterDate = function(id, minDate, maxDate, done) {
  console.log('get user filter date');
  var client = createDBClient();
  var queryString = 'SELECT * FROM spending WHERE id = $1 AND date BETWEEN $2 and $3';
  var query = client.query(queryString, [id, minDate, maxDate]);
  var spending = [];

  query.on('error', function(error) {
    done(error);
  });

  query.on('row', function(row) {
    var date = row.date;
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    client.end();
    done(null, spending);
  });
};

/**
  Inserts new username and password into db
  Callback function {@done} expects {@err} and {@isUsernameAlreadyInDB}
  @param username
  @param password
  @param callback function
*/
exports.insertUsernameAndPassword = function(username, password, done) {
  console.log('insert username and password');
  usernameExists(username, function(err, exists) {
    if (err) {done(err);}

    if (exists) {
      done(null, true);
    } else {

      var client = createDBClient();
      client.on('error', function(err) {
        callback(err);
      });
      var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      var query = client.query('INSERT INTO login (username, password) VALUES($1, $2)', [username, hash]);
      query.on('error', function(err) {
        done(err);
      });
      query.on('end', function() {
        client.end();
        done(null, false);
      });
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
    callback(null, result.rowCount > 0);
  });
}
