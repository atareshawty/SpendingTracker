var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../db');

router.get('/', function(req, res) {
  res.render('home');
});

router.get('/401', function(req, res) {
  res.render('401');
});

router.get('/about', function(req, res) {
  res.render('about');
});

router.get('/signup', function(req, res) {
  if(req.session.passport) {
      if(req.session.passport.user) {
        res.redirect('/users/' + req.session.passport.user.id);
      }
    } else {
      res.render('signup');
  }
});

router.get('/signupFailure', function(req, res) {
  res.render('signupFailure');
});

router.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.signup.insertUsernameAndPassword(username, password, function(err, isUsernameInDB) {
    if (err) {res.send('Whoops! Something went wrong');}
    if (isUsernameInDB) {
      res.redirect('/signupFailure');
    } else {
      res.redirect('/login');
    }
  });
});


module.exports = router;
