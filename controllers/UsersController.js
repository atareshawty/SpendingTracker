var db = require('../db/users.js');
var RedisClient
var redis = require('redis');

function UsersController() {
  this.new = function(req, res) {
    if (!req.isAuthenticated()) {
      if (req.query.usernametaken) {
        res.status(200).render('signup', {message: 'That username is alread taken! Try again'});
      } else {
        res.status(200).render('signup', {message: ''});
      }
    } else {
      res.redirect('/users/' + req.user.username);
    }
  }
  
  this.create = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    db.createUser(username, password, function(err, id) {
      if (err) {
        req.session.save();
        res.redirect('/signup?usernametaken=true');  
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
      res.render('user', {loggedIn: true});
    } else if (req.isAuthenticated()) {
      res.redirect('/users/' + req.user.username);
    } else {
      res.render('needLogin');
    }    
  }
}

module.exports = UsersController;
