var pg = require('pg');
var bcrypt = require('bcrypt-nodejs');
var config = require('../config');

var createDBClient = function() {
  var client = new pg.Client(config.db.postgres);
  client.connect();
  return client;
};

var client = createDBClient();
client.on('error', function(err) {
  console.log('Sorry, your database didn\'t set up correctly ' + err);
});

var testUsername = config.test.user.username;
var testPassword = bcrypt.hashSync(config.test.user.password, bcrypt.genSaltSync(10));
var testSpending = config.test.user.spending;
var testId = config.test.user.id;
var finalQuery;
console.log('Creating tables...');
client.query('INSERT INTO login VALUES($1,$2,$3)',[testId, testUsername, testPassword]);

for (var i = 0; i < testSpending.length; i++) {
	var insert = testSpending[i];
	finalQuery = client.query('INSERT INTO spending VALUES($1,$2,$3,$4,$5)', [testId, insert.cost, insert.category, insert.location, insert.date]);
}


finalQuery.on('end', function() {
  console.log('Done!');
	client.end();
});
