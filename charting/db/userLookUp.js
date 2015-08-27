var pg = require('pg');

var createDBClient = function() {
  var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';
  var client = new pg.Client(connectionString);
  client.connect();
  return client;
};

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    var client = createDBClient();
    var query = client.query('SELECT * FROM login WHERE username = $1',[username]);

    query.on('row', function(row) {
      var userRecord = {};
      console.log(row);

      if (row) {
        userRecord.id = row.id;
        userRecord.username = row.username;
        userRecord.password = row.password;
        return cb(null, userRecord);
      } else {
        return cb(null, null);
      }
    });
  });
}

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var client = createDBClient();
    var query = client.query('SELECT * from login WHERE id = $1', [id]);

    query.on('row', function(row) {
      var userRecord = {};
      if (row) {
        userRecord.id = row.id;
        userRecord.username = row.username;
        userRecord.password = row.password;
        cb(null, userRecord);
      } else {
        cb(new Error('User ' + id + ' does not exist'));
      }
    });
  });
}
