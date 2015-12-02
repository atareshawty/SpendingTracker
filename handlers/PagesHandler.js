var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');
var http = require('http');
var https = require('https');
var config = require('../config.js');

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
		if (req.isAuthenticated()) {
			var path;
			if (req.query.from && req.query.to) {
				path = "/api/users?id=" + req.session.passport.user.id + '&from=' + req.query.from + '&to=' + req.query.to;
			} else {
				path = "/api/users?id=" + req.session.passport.user.id;
			}
			var options = {
				"host": process.env.URL || 'localhost',
				"port": config.server.port,
				"path": path,
				"method": 'get'
			}
			var user;
			var request = http.request(options, function(response) {
				response.on('data', function(data) {
					user = JSON.parse(data);
					res.render('user', {user: user});
				});
			});
			request.end();
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