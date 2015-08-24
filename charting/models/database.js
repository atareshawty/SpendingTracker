var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE login (id int, username varchar(20), password varchar(20))');
query.on('end', function() { client.end(); });
