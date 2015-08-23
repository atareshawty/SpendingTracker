var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Track My Spending' });
});

router.get('/data', function(req, res) {
  var results = [];

  pg.connect(connectionString, function(err, client, done) {

    var query = client.query("SELECT * FROM spending;");

    query.on('row', function(row) {
      results.push(row);
    });


    query.on('end', function() {
      client.end();
      return res.json(results);
    })
    if(err) {
      console.log(err);
    }
  })
});

router.post('/data', function(req, res) {

      var results = [];

      var data = {id: req.body.id, name: req.body.name, cost: req.body.cost};

      pg.connect(connectionString, function(err, client, done) {

          client.query("INSERT INTO spending(id, name, cost) values($1, $2, $3)", [data.id, data.name, data.cost]);

          var query = client.query("SELECT * FROM spending ORDER BY id ASC");

          query.on('row', function(row) {
              results.push(row);
          });

          query.on('end', function() {
              client.end();
              return res.json(results);
          });

          // Handle Errors
          if(err) {
            console.log(err);
          }

      });
  });

module.exports = router;
