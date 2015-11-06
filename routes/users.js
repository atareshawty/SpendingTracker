var express = require('express');
var router = express.Router();
var db = require('../db/users.js');
var passport = require('passport');
var brcypt = require('bcrypt-nodejs');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');

router.get('/', function(req, res) {
  if(req.session.passport) {
      if(req.session.passport.user) {
        res.redirect('/users/' + req.session.passport.user.id);
      }
    } else {
      res.render('users', { title: 'Sample User'});
  }
});

router.get('/login', function(req, res, next) {
  if(req.session.passport) {
    if(req.session.passport.user) {
      res.redirect('/users/' + req.session.passport.user.id);
    }
  } else {
    res.render('login');
  }
});

router.get('/logout',
  function(req, res){
    req.session.destroy();
    res.redirect('/');
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

router.get('/:id', function(req, res) {
  if (isValidSession(req)) {
    if (isValidLogin(req)) {
      if (req.query.from) {
        db.getUserFilterDate(req.user.id, req.query.from, req.query.To, function(err, spending) {
          if (!err) {
            req.user.spending = spending;
            res.render('user', {user: req.user});
          } else {
            res.send('Database error');
          }
        });
      } else {
        res.render('user', { user: req.user });
      }
    } else {
      res.send('Don\'t try to access another user\'s information!');
    }
  } else {
    res.render('needLogin');
  }
});

router.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  db.insertUsernameAndPassword(username, password, function(err, isUsernameInDB) {
    if (err) {res.send('Whoops! Something went wrong with your signup');}
    if (isUsernameInDB) {
      res.redirect('/users/signupFailure');
    } else {
      passport.authenticate('local', {failureRedirect: '/401'});
      res.redirect('/users/login');
    }
  });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/401'}),
  function(req, res) {
    console.log('Made it to login post handler');
    res.redirect('/users/' + req.user.id);
});

router.post('/:id', function(req, res) {
  var transaction = new Transaction(req.body.cost, req.body.category, req.body.location, req.body.date);
  db.insertTransaction(req.user.id, transaction, function(err) {
    if (err) {
      console.log('Error: ' + err + '. From db.insertTransaction()');
    }
    res.redirect('back');
  });
});

function userMatchesURLReq(reqURL, userId) {
  var questionMarkIndex = reqURL.indexOf('?');
  var id;
  if (questionMarkIndex >= 0) {
    id = reqURL.substring(1, questionMarkIndex);
  } else {
    id = reqURL.substring(1, reqURL.length);
  }
  return id == userId;
}

function isValidSession(req) {
  return !(req.session.passport == null || req.session.passport.user == null);
}

function isValidLogin(req) {
  return userMatchesURLReq(req.url, req.session.passport.user.id);
}

function urlHasQuery(req) {
  return Object.keys(req.query).length === 0;
}

module.exports = router;
