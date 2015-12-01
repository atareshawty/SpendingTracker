var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');

function StaticHandler() {
	this.getHome = function(req, res) {
		res.status(200).render('home');
	};
	
	this.get401 = function(req, res) {
		res.status(200).render('401');
	};
	
	this.getAbout = function(req, res) {
		res.status(200).render('about');
	};
	
	this.getSampleUser = function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.render('users', { title: 'Sample User'});
		}
	};
	
	this.getLogin = function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.status(200).render('login');
		}
	};
	
	this.getLogout = function(req, res) {
		req.session.destroy();
		res.redirect('/');
	};
	
	this.getSignup = function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/users/' + req.session.passport.user.id);
		} else {
			res.status(200).render('signup');
		}
	};
	
	/**
	* Expecting post request to have params from and to properties for spending filtering
	**/
	this.getUser = function(req, res) {
		if (req.session.passport && req.isAuthenticated()) {
			var userId = req.session.passport.user.id || undefined;
			var from = req.query.from || undefined;
			var to = req.query.to || undefined;
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
	};
	
	this.createUser = function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
				
		db.insertUsernameAndPassword(username, password, function(err, isUsernameInDB) {
			if (err) {res.send('Whoops! Something went wrong with your signup');}
			if (isUsernameInDB) {
				console.log('Username is already in db');
				res.status(403).render('signupfailure');
			} else {
				res.status(200).redirect('/users/login');
			}
			});		
	};
	
	//See routes.js for authentication. Not handled here!
	this.postLogin = function(req, res) {
			res.status(200).redirect('/users/' + req.user.id);
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

module.exports = StaticHandler;