var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');

function APIHandler() {

	this.createUser = function(req, res) {
		var username = req.query.username || req.body.username;
		var password = req.query.password || req.body.password;
		
		db.insertUsernameAndPassword(username, password, function(err, inDB) {
			if (inDB) {
				res.status(403).send();
			} else {
				res.status(200).send();
			}
		})
	};
	
	this.getUserModel = function(req, res) {
		db.findById(req.params.id, req.query.from, req.query.to, function(err, user) {
			if (err) {
				res.status(500).send(err.message);
			} else {
				res.set('Content-Type', 'application/json');
				res.status(200).json(user);
			}
		})
	};
	
	this.deleteUser = function(req, res) {
		db.deleteUser(req.body.username, function(err, success) {
			if (success) {
				res.status(200).send();
			} else {
				res.status(500).send();
			}
		})
	
	}
}

module.exports = APIHandler;
