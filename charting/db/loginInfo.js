var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

var client = new pg.Client(connectionString);


exports.usernameExists = function(username) {
  var usernameExists = null;
  try {
    client.connect(function(err) {
      client.query('SELECT * FROM login WHERE username = $1 LIMIT 1', [username], function(err, results) {
        usernameExists = results.rowCount == 1;
        client.end();
      });
    });
    return usernameExists;
  } catch (err) {
    throw new Error('Something went wrong!' + err);
  }
}

exports.insertUsernameAndPassword = function(username, password) {
  try {
    client.connect(function(err) {
      client.query('INSERT INTO login (username, password) VALUES($1, $2)', [username, password], function(err) {
        client.end();
      });
    });
  } catch (err) {
    throw new Error('Something went wrong!' + err);
  }
}
