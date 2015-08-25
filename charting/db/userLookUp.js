var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

var client = new pg.Client(connectionString);
client.connect();

exports.createUserCreds = function(id, username, password) {
  var query = client.query('INSERT INTO login VALUES ($1, $2, $3)', [id, username, password]);
  query.on('end', function() { client.end(); });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    var queryString = 'SELECT * FROM login where username = $1';
    var query = client.query(queryString, [username]);
    var userRecord = {};

    query.on('row', function(row) {
      userRecord.id = row.id;
      userRecord.username = row.username;
      userRecord.password = row.password;
    });

    if (userRecord.username === username) {
      return cb(null, userRecord);
    } else {
      return cb(null, null);
    }
  });
}
