var RedisClient;
var redis = require('redis');

function SessionsController() {
  this.loginPage = function(req,res) {
    if (!req.isAuthenticated()) {
      if (req.query.auth) {
        res.render('login', {message: 'Username or password was incorrect. Try again'});
      } else {
        res.render('login', {message: ''});
      }
    } else {
      res.redirect('/users/' + req.user.username);
    }
  };
  
  //Authentication gets handled by passport in routes.js
  //User would already by authenticated when this function is called
  this.create = function(req,res) {
    RedisClient = redis.createClient();
    RedisClient.set(req.user.username, req.sessionID, function(err, reply) {
      console.log('Reply from redis set for session id', reply);
      RedisClient.end();
    });
    res.status(200).redirect('/users/' + req.user.username);
  };
  
  this.destroy = function(req, res) {
    req.session.destroy();
    res.redirect('/');
  };
}

module.exports = SessionsController;