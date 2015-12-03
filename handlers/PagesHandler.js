var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');
var request = require('request');
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
	
	this.getUser = function(req, res) {
		if (req.isAuthenticated()) {
			var propertiesObject = {
				"from": req.query.from || null,
				"to": req.query.to || null
			}
			console.log('from: ' + propertiesObject.from);
			console.log('to: ' + propertiesObject.to);
			var url = config.server.url + '/api/users/' + req.session.passport.user.id;
			request({url:url, qs:propertiesObject}, function(err, response, body) {
  			if(err) { console.log(err); return; }
				res.status(response.statusCode).render('user', {"user": JSON.parse(body)});
			});
			
		} else {
			res.render('needLogin');
		}
	};

	this.createUser = function(req, res) {
		if (req.body.username && req.body.username.length <= 20 && req.body.password) {
			var postObject = {
				"url": config.server.url + '/api/users',
				"qs": {"username": req.body.username, "password": req.body.password}
			}
			request.post(postObject, function(error, response, body) {
				if (response.statusCode != 200) {
					res.status(response.statusCode).render('signupFailure');
				} else {
					console.log('Status Code == 200');
					res.status(response.statusCode).redirect('/users/login');
				}
			})
		} else {
			res.send("Try again with a valid username (< 20 in length) and password")
		}
	
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