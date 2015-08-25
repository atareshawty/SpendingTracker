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
  try {
    var usernameExists = null;
    usernameExists = db.signup.usernameExists(req.body.username);
    while (usernameExists !== null) {console.log(usernameExists)}
    if (usernameExists) {
      res.send('That username already exists! Reload the page and try again');
    } else {
      db.signup.insertUsernameAndPassword(req.body.username, req.body.password);
      res.send('Successful entry of username and password!');
    }

  } catch(err) {
    res.send('Sorry about that error' + err);
  }

});


module.exports = router;
