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
function createUserObj(id, username, done) {
  console.log('\nCreating user');
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
  Callback params: {@err}, {@user} object, {@password} string
  @param username
  @param cb
*/
exports.findByUsername = function(username, done) {
  console.log('Find by username');
  process.nextTick(function() {
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
  });
};

/**
  Finds user by {@id} and returns user into {@cb} callback function
  Callback params: {@err}, {@user} object
  @param username
  @param cb
*/
exports.findById = function(id, minDate, maxDate, done) {
  console.log('Find by id');
  var client = createDBClient();
  var queryString, query;
  var username, spending = [], categories = [];
  
  if (minDate && maxDate) {
    queryString = "SELECT a.username, b.cost, b.category, b.location, b.date FROM login a INNER JOIN spending b ON a.id = b.id WHERE a.id = $1 AND b.date BETWEEN $2 and $3";
    query = client.query(queryString, [id, minDate, maxDate]);
  } else {
    queryString = "SELECT a.username, b.cost, b.category, b.location, b.date FROM login a INNER JOIN spending b ON a.id = b.id WHERE a.id = $1";
    query = client.query(queryString, [id]);
  }
  
  query.on('error', function(err) {
    console.log('Error on initial query' + err.message);
    done(err);
  });
  
  query.on('row', function(row) {
    username = row.username;
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });
  
  query.on('end', function() {
    var categoryQuery = client.query('SELECT category FROM categories WHERE id = $1',[id]);
    
    categoryQuery.on('error', function(err) {
      console.log('Error on category query' + err.message);
      done(err);
    });
    
    categoryQuery.on('row', function(row) {
      categories.push(row.category);
    });
    
    categoryQuery.on('end', function() {
      done(null, new User(id, username, spending, categories));
    })
  })
};

/**
  Gets all spending info from user {@id} between {@minDate} and {@maxDate}
  Callback params are {@err} and {@spending} which is an array of transactions
  @param id - id of user for which information is requested
  @param minDate - minimum date for which information is requested
  @param maxDate - maximum date for which information is requested
  @param callback function
*/
exports.getUser = function(id, minDate, maxDate, done) {
  console.log('get user');
  var client = createDBClient();
  var queryString, query;
  var spending = [];
  
  if (minDate && maxDate) {
    queryString = 'SELECT * FROM spending WHERE id = $1 AND date BETWEEN $2 and $3';
    query = client.query(queryString, [id, minDate, maxDate])
  } else {
    queryString = 'SELECT * FROM spending WHERE id = $1';
    query = client.query(queryString, [id]);
  }

  query.on('error', function(error) {
    done(error);
  });

  query.on('row', function(row) {
    spending.push(new Transaction(row.cost, row.category, row.location, row.date));
  });

  query.on('end', function() {
    client.end();
    done(null, spending);
  });
};

/**
  Inserts new username and password into db
  Callback function {@done} expects {@err} and {@isUsernameAlreadyInDB} - boolean
  @param username
  @param password
  @param callback function
*/
exports.insertUsernameAndPassword = function(username, password, done) {
  console.log('insert username and password');
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
};

/**
  Inserts new category into db based on user password
  Callback function only expects possible error
  @param user id
  @param string
  @param callback function
*/
exports.insertNewCategory = function(id, category, done) {
  console.log('Inserting new categories...');
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
};

exports.deleteUser = function(username, done) {
  console.log('Deleting user...');
  var client = createDBClient();
  var loginQueryString = 'DELETE FROM login WHERE username=$1';
  var categoriesQueryString = 'DELETE FROM categories WHERE id=$1';
  var spendingQueryString = 'DELETE FROM spending WHERE id=$1';
  
  getId(username, function(err, id) {
    if (err) done(err);
    client.query(loginQueryString, [username]);
    client.query(categoriesQueryString, [id]);
    var query = client.query(spendingQueryString, [id]);
    query.on('end', function() {
      client.end();
      done(false, true);
    })
  });
}

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
  })

}

/**
 * Checks to see whether or not a username exists
 * Callback function {@done} expects err and boolean
 * @param username
 * @param callback function
 */ 
function usernameExists(username, done) {
  console.log('Username exists');
  var client = createDBClient(), query;
  client.on('error', function(err) {
    done(err);
  });
  
  query = client.query('SELECT * FROM login WHERE username = $1', [username]);
  query.on('end', function(result) {
    client.end();
    done(null, result.rowCount > 0);
  });
}

function getId(username, done) {
  console.log('Username exists');
  var client = createDBClient(), query;
  client.on('error', function(err) {
    done(err);
  });
  var id;
  query = client.query('SELECT * FROM login WHERE username = $1', [username]);
  query.on('row', function(row) {
    id = row.id;
  });
  
  query.on('end', function() {
    client.end();
    done(null, id);
  })
}
