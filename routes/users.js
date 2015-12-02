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
  if(req.isAuthenticated()) {
    res.redirect('/users/' + req.session.passport.user.id);
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
  if(req.isAuthenticated()) {
    res.redirect('/users/' + req.session.passport.user.id);
  } else {
    res.render('signup');
  }
});

router.get('/signupFailure', function(req, res) {
  res.render('signupFailure');
});

router.get('/:id', function(req, res) {
  if (req.isAuthenticated()) {
    var userId = req.session.passport.user.id || undefined;
    var from = req.query.from || undefined;
    var to = req.query.to || undefined;
    console.log(from);
    console.log(to)
      db.getUser(userId, from, to, function(err, spending) {
        if (!err) {
          req.user.spending = spending;
          var newUser = new User(userId, req.user.username, req.user.spending, req.user.categories);
          newUser.total = newUser.getTotalSpending();
          res.render('user', {user: newUser});
        } else {
          res.send('Database error');
        }
      });
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
      res.redirect('/users/' + req.user.id);
    });

router.post('/:id', function(req, res) {
  if (req.body.cost) {
    handleTransactionPost(req, res);
  } else if (req.body.category) {
    handleCategoryPost(req, res);
  } else {
    res.redirect('back');
  }
});

function handleTransactionPost(req, res) {
  var transaction = new Transaction(req.body.cost, req.body.category, req.body.location, req.body.date);
  db.insertTransaction(req.user.id, transaction, function(err) {
    if (err) {
      console.log('Error: ' + err + '. From db.insertTransaction()');
    }
    res.redirect('back');
  });
}

function handleCategoryPost(req, res) {
  db.insertNewCategory(req.user.id, req.body.category, function(err) {
    if (err) {
      console.log('Error: ' + err + '. From insertNewCategory()');
    }
    res.redirect('back');
  });
}

module.exports = router;
