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
					res.status(response.statusCode).redirect('/users/login');
				}
			})
		} else {
			res.send("Try again with a valid username (< 20 in length) and password");
		}
	};
	
	//See routes.js for authentication. Not handled here!
	this.postLogin = function(req, res) {
			res.status(200).redirect('/users/' + req.user.id);
	};

	this.postUser = function(req, res) {
		var postObject;
		if (req.body.cost) {
			postObject = {
				"url": config.server.url + '/api/users/' + req.session.passport.user.id,
				"qs": {"cost": req.body.cost,
							 "category": req.body.category,
							 "location": req.body.location,
							 "date": req.body.date
							 }
			}
		} else if (req.body.category) {
			postObject = {
				"url": config.server.url + '/api/users/' + req.session.passport.user.id,
				"qs": { "category": req.body.category}
			}	
		} else {
			res.status(403).send('You need to send more than that!');
		}
		
		request.post(postObject, function(error, response, body) {
			if (response.statusCode != 200) {
				res.status(response.statusCode).send(body);
			} else {
				res.status(response.statusCode).redirect('back');
			}
		});
	};
	
	this.deleteUser = function(req, res) {
		var id = req.params.id || req.body.id;
		console.log('Delete request for id = '+ id);
		if (req.isAuthenticated() && id == req.session.passport.user.id) {
			var postObject = {
				"url": config.server.url + '/api/users/' + id
			};

			request.del(postObject, function(error, response, body) {
				res.status(response.statusCode).redirect(config.server.url);
			});
			
		} else {
			res.status(403).send();
		}	
	};	
}

module.exports = StaticHandler;