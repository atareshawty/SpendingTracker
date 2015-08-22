var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/user_spending';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Track My Spending' });
});

module.exports = router;
