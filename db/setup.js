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

console.log('Creating tables...');
client.query('CREATE TABLE users (id serial primary key, username varchar(30) UNIQUE, password varchar(60))')
client.query('CREATE TABLE spending (id int NOT NULL DEFAULT 0.00, cost float NOT NULL, category varchar(20), location varchar(30), date varchar(20))');
client.query('CREATE TABLE categories (id int, category varchar(20), UNIQUE(id, category))');
client.query('ALTER TABLE users ADD CONSTRAINT username_length CHECK (char_length(password) > 0)');
client.query('ALTER TABLE spending ADD CONSTRAINT purchase_length CHECK(char_length(category) > 0 AND char_length(location) > 0 AND char_length(date > 0))');
var finalQuery = client.query('ALTER TABLE categories ADD CONSTRAINT category_length CHECK(char_length(category) > 0)');

finalQuery.on('end', function() {
  console.log('Done!');
  client.end();
});
