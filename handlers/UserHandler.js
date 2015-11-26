var router = require('express').Router();
var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var passport = require('passport');
var brcypt = require('bcrypt-nodejs');

function UserHandler() {
	this.getSampleUser = function(req, res) {
		if (req.session.passport && req.session.user.id) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.render('users', { title: 'Sample User'});
		}
	};
	
	this.getLogin = function(req, res) {
		if (req.session.passport && req.session.user.id) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.render('login');
		}
	};
	
	this.getLogout = function(req, res) {
		req.session.destroy();
		res.redirect('/');
	};
	
	this.getSignup = function(req, res) {
		if (req.session.passport && req.session.user.id) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.render('signup');
		}
	};
	
	this.getUser = function(req, res) {
		if (isValidSession(req)) {
			if (isValidLogin(req)) {
				if (req.query.from && req.query.To) {
					db.getUserFilterDate(req.user.id, req.query.from, req.query.To, function(err, spending) {
						if (!err) {
							req.user.spending = spending;
							var newUser = new User(req.user.id, req.user.username, req.user.spending, req.user.categories);
							newUser.total = newUser.getTotalSpending();
							res.render('user', {user: newUser});
						} else {
							res.send('Database error');
						}
						});
				} else {
					db.findByUsername(req.user.username, function(err, user, userPassword) {
						user.total = user.getTotalSpending();
						res.render('user', { user: user });
					});
				}
			} else {
			res.send('Don\'t try to access another user\'s information!');
			}
		} else {
			res.render('needLogin');
		}	
	};
	
	this.createUser = function(req, res) {
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
	};

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

function isValidSession(req) {
  return !(req.session.passport == null || req.session.passport.user == null);
}

function isValidLogin(req) {
	return req.session.passport.user.id == req.url.substring(req.url.length - 2, req.url.length);
}

function urlHasQuery(req) {
  return Object.keys(req.query).length === 0;
}

module.exports = UserHandler;