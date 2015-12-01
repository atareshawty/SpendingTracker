var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');

function UserHandler() {
	this.createUser = function(req, res) {
		
	};
	
	this.getUserModel = function(req, res) {
		db.findById(req.body.id, function(err, user) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.set('Content-Type', 'application/json');
				res.status(200).json(user);
			}
		})
	};
	
	this.deleteUser = function(req, res) {
		
	}
}

module.exports = UserHandler;