var passport = require('passport');

function SessionsController() {
	this.loginPage = function(req,res) {
    if (req.flash) {
      res.render('login', {message: req.flash('error')});
    } else {
      res.render('login');
    }
  }
  
  this.create = function(req,res) {
    res.status(200).redirect('/users/' + req.user.id);
  }
  
  this.destroy = function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = SessionsController;