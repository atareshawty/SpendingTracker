/* global process */
var db = require('../db/users.js');
var bcrypt = require('bcrypt-nodejs');
var redis = require('redis');
var cookieParser = require('cookie-parser');
var config = require('../config.js');
var secret = process.env.PASSPORT_SECRET || config.passport.secret;

function APIController() {
  this.getUser = function(req, res) {
    if (req.params.username && req.headers.cookie) {
      authThroughRedisStore(req.params.username, req.headers.cookie, function(err, user) {
        if (err) {
          res.send(err);
        } else {
          res.json(user);
        }
      });
      
    } else if (req.body.username && req.body.password) {
      authThroughDB(req.body.username, req.body.password, function(err, user) {
        if (err) {
          res.status(401).send(err);
        } else {
          res.json(user);
        }
      });
      
    } else {
      res.status(401).send('Woah there! You can\'t have that data...');
      res.end();
    }
  };
}

//Returns json if authentication works
function authThroughRedisStore(username, cookie, done) {
  var RedisClient = redis.createClient();
  RedisClient.get(username, function(err, reply) {
    if (err) {RedisClient.end(); done(err);}
    if (replySIDMatchesCookieSID(reply, cookie)) {
      db.findByUsername(username, function(err, user) {
        if (err) {RedisClient.end(); done(err);}
        RedisClient.end();
        done(null, user);
      })
    } else {
      RedisClient.end();
      done(null, undefined);
    }
  });
}

//Returns json if authentication works
function authThroughDB(username, password, done) {
  db.findByUsername(username, function(err, user, userPassword) {
    if (err) {
      done(err);
    } else if (!user) {
      done(null, undefined);
    } else if (!bcrypt.compareSync(password, userPassword)) {
      done({auth: false});
    } else {
      done(null, user);
    } 
  });
}

function replySIDMatchesCookieSID(reply, cookie) {
  //String.prototype.includes part of ECMAScript6 and not implemented in Node yet
  if (!String.prototype.includes) {
    String.prototype.includes = function() {'use strict';
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
  }
  return cookie.includes(reply);
}

function respondJSON(username, response) {
  db.findByUsername(username, function(err, user) {
    if (err) {
      response.send(err.message);
    } else {
      response.json(user);
    }
  });
}

module.exports = APIController;