var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Track My Spending' });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  db.signup.insertUsernameAndPassword(username, password, function(err, isUsernameInDB) {

    if (err) {res.send('Whoops! Something went wrong');}
    if (isUsernameInDB) {
      res.send('That username was already taken. Reload the page and try again');
    } else {
      res.send('The username and password was successfully added to the db! Have a beer');
    }
  });
});


module.exports = router;
