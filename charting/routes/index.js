var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../db');

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    console.log(req.user);
    res.redirect('/users/' + req.user.id);
  });

router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/signupFailure', function(req, res, next) {
  res.render('signupFailure');
});

router.get('/signupSuccess', function(req, res, next) {
  res.render('signupSuccess');
})

router.post('/signup', function(req, res, next) {
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
