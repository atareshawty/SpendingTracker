var db = require('../db/users.js');
var User = require('../public/javascripts/userModel.js');
var Transaction = require('../public/javascripts/transactionModel.js');
var brcypt = require('bcrypt-nodejs');

function APIHandler() {

	this.createUser = function(req, res) {
		var username = req.query.username || req.body.username;
		var password = req.query.password || req.body.password;
		
		db.insertUsernameAndPassword(username, password, function(err, inDB) {
			if (err) {
				res.status(503).send();
			} else if (inDB) {
				res.status(403).send();
			} else {
				res.status(201).send();
			}
		})
	};
	
	this.getUser = function(req, res) {
		db.findById(req.params.id, req.query.from, req.query.to, function(err, user) {
			if (err) {
				res.status(503).send(err.message);
			} else {
				res.set('Content-Type', 'application/json');
				res.status(200).json(user);
			}
		})
	};
	
	this.deleteUser = function(req, res) {
		db.deleteUser(req.params.id, function(err, success) {
			if (success) {
				res.status(202).send();
			} else {
				res.status(503).send();
			}
		})
	};
	
	this.updateUser = function(req, res) {
		var cost = req.query.cost || req.body.cost;
		var category = req.query.category || req.body.category;
		var location = req.query.location || req.body.location;
		var date = req.query.date || req.body.date;

		if (cost && category && location && date) {
			handleTransactionPost(cost, category, location, date, req, res);
		} else if (category) {
			handleCategoryPost(category, req, res);
		} else {
			res.status(406).send('You need to provide more information than that!');
		}
	}
}

function handleTransactionPost(cost, category, location, date, req, res) {
  var transaction = new Transaction(cost, category, location, date);
  db.insertTransaction(req.params.id, transaction, function(err) {
    if (err) {
      res.send(503).send('Database error');
    }
    res.status(201).send();
  });
}

function handleCategoryPost(category, req, res) {
	db.insertNewCategory(req.params.id, category, function(err) {
		if (err) {
			res.send(503).send('Database error');
		}
		res.status(201).send();
  });
}

module.exports = APIHandler;
