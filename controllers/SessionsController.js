var RedisClient
var redis = require('redis');

function SessionsController() {
	this.loginPage = function(req,res) {
    if (!req.isAuthenticated()) {
      if (req.flash('error')) {
        res.render('login', {message: req.flash('error')});
      } else {
        res.render('login');
      }
    } else {
      res.redirect('/users/' + req.user.id);
    }
  }
  
  //Authentication gets handled by passport in routes.js
  //User would already by authenticated when this function is called
  this.create = function(req,res) {
    RedisClient = redis.createClient();
    RedisClient.set(req.user.username, req.sessionID, function(err, reply) {
      console.log('Reply from redis set for session id', reply);
      RedisClient.end();
    });
    res.status(200).redirect('/users/' + req.user.id);
  }
  
  this.destroy = function(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = SessionsController;