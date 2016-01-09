var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');
var passport = require('passport');

function UsersController() {
  this.new = function(req, res) {
    if (!req.isAuthenticated()) {
      if (req.flash('signup error')) {
        res.status(200).render('signup', {message: req.flash('signup error')});
      } else {
        res.status(200).render('signup');
      }
    } else {
      res.redirect('/users/' + req.user.id);
    }
  }
  
  this.create = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    db.createUser(username, password, function(err, id) {
      if (err) {
        req.flash('signup error', err.message);
        req.session.save();
        res.redirect('/signup');  
      } else {
        var user = {id: id, username: username};
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.send(err.message);
          } else {
            res.status(200).redirect('/users/' + username);
          }
        });
      }
    });    
  }
  
  this.show = function(req, res) {
    if (req.isAuthenticated() && req.params.username) {
      db.getSpending(req.user.id, req.query.from, req.query.to, function(err, spending, total) {
        if (!err) {
          req.user.spending = spending;
          req.user.total = total;
          req.user.errorMessage = req.flash('DB error');
          res.render('fetchTest');
        } else {
          req.flash('DB error', err.message);
          res.status(500).redirect('/users/' + res.user.username);
        }
      });
    } else if (req.isAuthenticated()) {
      res.redirect('/users/' + req.user.username);
    } else {
      res.render('needLogin');
    }    
  }

  this.postUser = function(req, res) {
    if (req.body.cost) {
      handleTransactionPost(req, res);
    } else if (req.body.category) {
      handleCategoryPost(req, res);
    } else {
      res.redirect('back');
    }
  };
}

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

module.exports = UsersController;
