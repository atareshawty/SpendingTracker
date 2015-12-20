/* global process */
var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');

function createDBClient() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/spending_tracker_development';
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
function createUserObj(id, username, done) {
  var client = createDBClient();
  var query = client.query('SELECT * FROM spending WHERE id = $1', [id]);
  var spending = [];

  query.on('error', function(error) {
      done(error);
  });

  query.on('row', function(row) {
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    client.end();
    getCategories(id, function(err, categories) {
      if (err) {
        done(err);
      } else {
        done(null, new User(id, username, spending, categories));
      }
    });
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
  if (id && transaction.cost && transaction.category && transaction.location && transaction.date) {
    var client = createDBClient();
    var queryString = 'INSERT INTO spending VALUES($1, $2, $3, $4, $5)';
    var query = client.query(queryString,[id, transaction.cost, transaction.category, transaction.location, transaction.date]);
    query.on('error', function(err) {
      client.end();
      done(err);
    });
    query.on('end', function(row) {
      client.end();
      done(null);
    });  
  } else {
    done('Not enough information provided');
  }
};

/**
  Finds user by {@username} and returns user into {@cb} callback function
  Callback params: {@err}, {@user} object, {@password} string
  @param username
  @param cb
*/
exports.findByUsername = function(username, done) {
  if (username) {  
    var client = createDBClient();
    var query = client.query('SELECT * FROM login WHERE username = $1',[username]);

    query.on('error', function(error) {
      done(error);
    });

    query.on('row', function(row, result) {
      result.addRow(row);
    });

    query.on('end', function(result) {
      client.end();
      if (result.rowCount === 1) {
        var row = result.rows[0];
        createUserObj(row.id, row.username, function(err, user) {
            if (err) {done(err);}
            done(null, user, row.password);
        });
      } else {
        done(null, null);
      }
    });
  } else {
    done('Need to provide a username');
  }
};

/**
  Gets all spending info from user {@id} between {@minDate} and {@maxDate}
  Callback params are {@err}, {@spending} which is an array of transactions
  and {@total} which is total spending (float)
  @param id - id of user for which information is requested
  @param minDate - minimum date for which information is requested
  @param maxDate - maximum date for which information is requested
  @param callback function
*/
exports.getSpending = function(id, minDate, maxDate, done) {
  if (id) {
    var client = createDBClient();
    var queryString, query;
    var spending = []
    var total = 0;

    if (minDate && maxDate) {
      queryString = 'SELECT * FROM spending WHERE id = $1 AND date BETWEEN $2 and $3 ORDER BY date asc';
      query = client.query(queryString, [id, minDate, maxDate])
    } else {
      queryString = 'SELECT * FROM spending WHERE id = $1 ORDER BY date asc';
      query = client.query(queryString, [id]);
    }

    query.on('error', function(error) {
      done(error);
    });

    query.on('row', function(row) {
      spending.push(new Transaction(row.cost, row.category, row.location, row.date));
      total += row.cost;
    });

    query.on('end', function() {
      client.end();
      total.toPrecision(2);
      done(null, spending, total);
    });
  } else {
    done('Please provide an id');
  }
};

/**
  Inserts new username and password into db
  Callback function {@done} expects {@err} and {@isUsernameAlreadyInDB} - boolean
  @param username
  @param password
  @param callback function
*/
exports.insertUsernameAndPassword = function(username, password, done) {
  if (username && password) {
    usernameExists(username, function(err, exists) {
      if (err) {
        done(err);
      } else if (exists) {
        done(null, true);
      } else {
        password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        var client = createDBClient();
        var query = client.query('INSERT INTO login (username, password) VALUES($1, $2)', [username, password]);
        query.on('end', function() {
          client.end();
          done(null, false);
        })
      }
    });
  } else {
    done('Provide both username and password');
  }
};

/**
  Inserts new category into db based on user password
  Callback function only expects possible error
  @param user id
  @param string
  @param callback function
*/
exports.insertNewCategory = function(id, category, done) {
  if (id && category) {
    var client = createDBClient();
    var queryString = 'INSERT INTO categories VALUES($1, $2)';
    var query = client.query(queryString, [id, category]);

    query.on('error', function(err) {
      done(err);
    });

    query.on('end', function() {
      client.end();
      done(null);
    });
  } else {
    done('Need to provide both id and category');
  }
};

/**
  Retrieves all categories (default and personalized) from db
  Callback function {@done} expects {@err} and {@categories} - an array of strings
  @param user id for which personalized categories exist
  @param callback function
*/
function getCategories(id, done) {
 if (id) {
    var client = createDBClient();
    var categoryQueryString = 'SELECT category FROM categories WHERE id = 0 OR id = $1';
    var categoryQuery = client.query(categoryQueryString, [id]);
    var categories = [];

    categoryQuery.on('error', function(err) {
      done(err);
    });

    categoryQuery.on('row', function(row) {
        categories.push(row.category);
    });

    categoryQuery.on('end', function() {
      client.end();
      done(null, categories);
    });
 } else {
   done('Need to provide an id');
 }
}

/**
 * Checks to see whether or not a username exists
 * Callback function {@done} expects err and boolean
 * @param username
 * @param callback function
 */
function usernameExists(username, done) {
  var client = createDBClient()
  var query;
  client.on('error', function(err) {
    done(err);
  });

  query = client.query('SELECT * FROM login WHERE username = $1', [username]);
  query.on('end', function(result) {
    client.end();
    done(null, result.rowCount > 0);
  });
}
