var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://https://shielded-brook-3126.herokuapp.com?ssl=true';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

exports.insertUsernameAndPassword = function(username, password, callback) {
  var client = createDBClient();

  client.on('error', function(err) {
    callback(err);
  });

  var checkQuery = client.query('SELECT * FROM login WHERE username = $1',[username]);
  checkQuery.on('end', function(result) {
    var isUsernameInDB = result.rowCount > 0;
    if (!isUsernameInDB) {
      var hash = bcrypt.hashSync(password, 10);
      var insertQuery = client.query('INSERT INTO login (username, password) VALUES($1,$2)', [username, hash]);
      insertQuery.on('end', function() {
        client.end();
        callback(null, isUsernameInDB);
      });
    } else {
      client.end();
      callback(null, isUsernameInDB);
    }
  });
};
