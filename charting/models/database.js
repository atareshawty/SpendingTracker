var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('INSERT INTO spending VALUES (1, \'Russell\', 100.25)');
query.on('end', function() { client.end(); });
