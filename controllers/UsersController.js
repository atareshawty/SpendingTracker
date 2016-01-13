var db = require('../db/users.js');
var RedisClient
var redis = require('redis');

function UsersController() {
  this.new = function(req, res) {
    if (!req.isAuthenticated()) {
      if (req.flash('signup error')) {
        res.status(200).render('signup', {message: req.flash('signup error')});
      } else {
        res.status(200).render('signup');
      }
    } else {
      res.redirect('/users/' + req.user.id);
    }
  }
  
  this.create = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    db.createUser(username, password, function(err, id) {
      if (err) {
        req.flash('signup error', err.message);
        req.session.save();
        res.redirect('/signup');  
      } else {
        var user = {id: id, username: username};
        //Login, store session id, and redirect to profile page
        req.logIn(user, function(err) {
          if (err) {
            console.log(err);
            res.send(err.message);
          } else {
            RedisClient = redis.createClient();
            RedisClient.set(username, req.sessionID, function(err, reply) {
              console.log('Reply from redis set for session id', reply);
              RedisClient.end();
            });
            res.status(200).redirect('/users/' + username);
          }
        });
      }
    });    
  }
  
  this.show = function(req, res) {
    //If user is logged in and at users/:username
    if (req.isAuthenticated() && req.params.username) {
      db.getSpending(req.user.id, req.query.from, req.query.to, function(err, spending, total) {
        if (!err) {
          res.render('user');
        } else {
          req.flash('DB error', err.message);
          res.status(500).redirect('/users/' + res.user.username);
        }
      });
    } else if (req.isAuthenticated()) {
      res.redirect('/users/' + req.user.username);
    } else {
      res.render('needLogin');
    }    
  }
}

module.exports = UsersController;
