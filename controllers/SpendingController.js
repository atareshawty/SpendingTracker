var db = require('../db/users.js');
var Transaction = require('../public/javascripts/transactionModel.js');

function SpendingController() {
	this.newPurchase = function(req, res) {
    var purchase = new Transaction(parseFloat(req.body.cost), req.body.category, req.body.location, req.body.date);
    console.log(purchase);
    db.insertSpending(req.user.id, purchase, function(err) {
      if (err) {
        //put flash message - redirect is temporary
        console.log(err);
        res.redirect('401');
      } else {
        res.redirect('/users/' + req.user.id);
      }
    });
  }
  
  this.newCategory = function(req, res) {
    db.insertNewCategory(req.user.id, req.body.category, function(err) {
      if (err) {
        //put flash message - redirect is temporary
        console.log(err);
        res.redirect('401');
      } else {
        res.redirect('/users/' + req.user.id);
      }
    });
  }
}

module.exports = SpendingController;