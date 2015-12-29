var db = require('../db/users.js');
var Transaction = require('../public/javascripts/transactionModel.js');

function SpendingController() {
	this.newPurchase = function(req, res) {
    var purchase = new Transaction(parseFloat(req.body.cost), req.body.category, req.body.location, req.body.date);
    db.insertPurchase(req.user.id, purchase, function(err) {
      if (err) {
        req.flash('DB error', err.message);
        req.session.save();
        res.status(500).redirect('/users/' + req.user.id);
      } else {
        res.status(200).redirect('/users/' + req.user.id);
      }
    });
  }
  
  this.newCategory = function(req, res) {
    db.insertNewCategory(req.user.id, req.body.category, function(err) {
      if (err) {
        req.flash('DB error', err.message);
        req.session.save();
        res.status(500).redirect('/users/' + req.user.id);
      } else {
        res.status(200).redirect('/users/' + req.user.id);
      }
    });
  }
}

module.exports = SpendingController;