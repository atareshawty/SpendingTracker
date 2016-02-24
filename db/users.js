/* global process */
var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');
var User = require('./userModel.js');
var Transaction = require('./transactionModel.js');
var config = require('../config.js');

function createDBClient() {
  var connectionString = config.db.postgres;
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
}

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
  var query = client.query('SELECT * FROM spending WHERE id = $1 ORDER BY date asc', [id]);
  var spending = [];
  var total = 0;

  query.on('error', function(error) {
    done(error);
  });

  query.on('row', function(row) {
    total += row.cost;
    spending.push(new Transaction(parseFloat(row.cost.toFixed(2)), row.category, row.location, row.date));
  });

  query.on('end', function() {
    client.end();
    getCategories(id, function(err, categories) {
      if (err) {
        done(err);
      } else {
        done(null, new User(id, username, spending, categories, total));
      }
    });
  });
}

/**
  Inserts transaction {@transaction} into db, for user with id = {@id}
  Callback function {@done} expects {@err}
  @param username - username
  @param transaction - inserted into db
  @param done - callback function
*/
exports.insertPurchase = function(username, purchase, done) {
  if (validateDate(purchase.date) && !isNaN(parseFloat(purchase.cost))) {
    purchase.cost = parseFloat(purchase.cost.toFixed(2));
    var client = createDBClient();
    var queryString = 'INSERT INTO spending (id, cost, category, location, date) VALUES((select id from users where username=$1), $2, $3, $4, $5)';
    var query = client.query(queryString,[username, purchase.cost, purchase.category, purchase.location, purchase.date]);
    query.on('error', function(err) {
      client.end();
      done(err);
    });
    query.on('end', function() {
      client.end();
      done(null);
    });  
  } else {
    done({message: 'Improper purchase formatting'});
  }
};

/**
  Finds user by {@username} and returns user into {@cb} callback function
  Callback params: {@err}, {@user} object, {@password} string
  @param username
  @param cb
*/
exports.findByUsername = function(username, done) {  
  var client = createDBClient();
  var query = client.query('SELECT * FROM users WHERE username = $1',[username]);

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
  var client = createDBClient();
  var queryString, query;
  var spending = [];
  var total = 0;
  
  if (typeof minDate == 'function') {
    done = minDate;
    minDate = {};
    maxDate = {};
  }

  if (validateDate(minDate) && validateDate(maxDate)) {
    queryString = 'SELECT * FROM spending WHERE id = $1 AND date BETWEEN $2 and $3 ORDER BY date asc';
    query = client.query(queryString, [id, minDate, maxDate]);
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
    total = parseFloat(total.toFixed(2));
    done(null, spending, total);
  });
};

exports.getSpendingWithUsername = function(username, minDate, maxDate, done) {
  if (typeof minDate === 'function') {
    done = minDate,
    minDate = {},
    maxDate = {};
  }
  var client = createDBClient();
  var queryString, query, spending = [], total = 0;
  
  if (validateDate(minDate) && validateDate(maxDate)) {
    queryString = 'SELECT * FROM spending WHERE date BETWEEN $1 and $2 AND id = (SELECT id from users WHERE username = $3) ORDER BY date';
    query = client.query(queryString, [minDate, maxDate, username]);
  } else {
    queryString = 'SELECT * FROM spending WHERE id = (SELECT id FROM users WHERE username = $1) ORDER BY date';
    query = client.query(queryString, [username]);
  }
  
  query.on('error', function(err) {
    client.end();
    console.log('Error from getSpendingFromUsername', err);
    done(err);
  });
  
  query.on('row', function(row) {
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
    total += row.cost;
  });
  
  query.on('end', function() {
    client.end();
    total = parseFloat(total.toFixed(2));
    done(undefined, spending, total);
  });
};


/**
  Inserts new username and password into db
  Callback function {@done} expects {@err} and {@id}
  @param username
  @param password
  @param callback function
*/
exports.createUser = function(username, password, done) {
  var client = createDBClient();
  var hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  var queryString = 'INSERT INTO users (username, password) VALUES($1, $2) RETURNING id';
  
  client.query(queryString, [username, hashedPassword], function(err, result) {
    if (err) {
      done(err, null);
    } else {
      done(null, result.rows[0].id);
    }
  });
};

/**
  Inserts new category into db based on user password
  Callback function only expects possible error
  @param user id
  @param string
  @param callback function
*/
exports.insertNewCategory = function(username, category, done) {
  var client = createDBClient();
  var queryString = 'INSERT INTO categories (id, category) VALUES((SELECT id FROM users WHERE username=$1), $2)';
  var query = client.query(queryString, [username, category]);

  query.on('error', function(err) {
    done(err);
  });

  query.on('end', function() {
    client.end();
    done(null);
  });
};

exports.deleteIndividualPurchase = function(username, purchase, done) {
  if (validateTransaction(purchase)) {
    var client = createDBClient();
    var queryString = 'DELETE FROM spending WHERE ctid = (SELECT ctid FROM spending WHERE id = (SELECT id FROM users WHERE username = $1) AND cost = $2 AND category = $3 AND location = $4 AND date = $5 LIMIT 1)';
    var query = client.query(queryString, [username, purchase.cost, purchase.category, purchase.location, purchase.date]);
    
    query.on('error', function(err) {
      done(err);
    });
    
    query.on('end', function() {
      client.end();
      done(null, true);
    });
  } else {
    done('Bad purchase format');
  }
};

exports.validateDate = validateDate;
exports.validateTransaction = validateTransaction;

/**
  Retrieves all categories (default and personalized) from db
  Callback function {@done} expects {@err} and {@categories} - an array of strings
  @param user id for which personalized categories exist
  @param callback function
*/
function getCategories(id, done) {
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
}

function validateDate(date) {
  return typeof date === 'string' && /^\d{4}[-]\d{2}[-]\d{2}$/.test(date);
}

function validateTransaction(transaction) {
  return typeof transaction.cost === 'number' && typeof transaction.category === 'string' && 
         typeof transaction.location === 'string' && validateDate(transaction.date) &&
         transaction.category.length <= 20 && transaction.location.length <= 20;
}