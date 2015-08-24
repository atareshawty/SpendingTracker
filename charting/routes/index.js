var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Track My Spending' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  console.log('\n\nWe got a post requrest!\n' + req + '\n\n\n');
  res.render('login');
})

router.get('/about', function(req, res, next) {
  res.render('about');
})

module.exports = router;
