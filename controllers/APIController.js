/* global process */
var db = require('../db/users.js');
var bcrypt = require('bcrypt-nodejs');
var redis = require('redis');

function APIController() {
  this.getUser = function(req, res) {
    authenticate(req, function(err, authenticated) {
      if (err) {res.status(500).send(err);}
      if (authenticated) {
        var username = req.params.username || req.body.username;
        db.findByUsername(username, function(err, user) {
          if (err) {res.status(500).send(err);}
          res.json(user);
        });
      } else {
        res.status(401).send('You can\t access that data!');
      }
    });
  };

  this.getSpending = function(req, res) {
    authenticate(req, function(err, authenticated) {
      if (err) {res.status(500).send(err);}
      if (authenticated) {
        var username = req.params.username || req.body.username;
        var from = req.body.from || req.query.from;
        var to = req.body.to || req.query.to;
        db.getSpendingWithUsername(username, from, to, function(err, spending, total) {
          res.json({'spending': spending, 'total': total});
        });
      } else {
        res.status(401).send('You can\t access that data!');
      }
    });
  };

  this.newSpending = function(req, res) {
    authenticate(req, function(err, authenticated) {
      if (err) {res.status(500).send(err);}
      if (authenticated) {
        var username = req.params.username || req.body.username;
        var purchase = {
          cost: parseInt(req.body.cost || req.query.cost),
          category: req.body.category || req.query.category,
          location: req.body.location || req.query.location,
          date: req.body.date || req.query.date
        };
        db.insertPurchase(username, purchase, function(err) {
          if (err) {res.status(500).send(err);}
          else {res.status(200).send();}
        });
      } else {
        res.status(401).send('You can\t access that data!');
      }
    });
  };

  this.newCategory = function(req, res) {
    authenticate(req, function(err, authenticated) {
      if (err) {res.status(500).send(err);}
      if (authenticated) {
        var username = req.params.username || req.body.username;
        var category = req.body.category || req.query.category;
        db.insertNewCategory(username, category, function(err) {
          if (err) {res.status(500).send(err);}
          else {res.status(200).send();}
        });
      } else {
        res.status(401).send('You can/t make that unauthenticated request!');
      }
    });
  };

  //For desktop app only! Don't user anywhere else!
  this.loginUser = function(req,res) {
    authThroughDB(req.body.username, req.body.password, function(err, auth) {
      if (auth) {
        var RedisClient = redis.createClient();
        var hashedUsername = bcrypt.hashSync(req.body.username, bcrypt.genSaltSync(10));
        RedisClient.set(req.body.username + 'Desktop', hashedUsername, function(err) {
          if (err) res.status(500).send();
          else  {
            res.status(200);
            res.send(hashedUsername);
          }
        });
      }
      else res.status(401).send();
    });
  };

  //For desktop app only! Don't user anywhere else!
  this.logoutUser = function(req, res) {
    var RedisClient = redis.createClient();
    RedisClient.del(req.body.username + 'Desktop', function(err) {
      if (err) res.status(500).send();
      else res.status(200).send();
    });
  };

  this.deletePurchase = function(req, res) {
    authenticate(req, function(err, authenticated) {
      if (err) {res.status(500).send(err);}
      if (authenticated){
        var username = req.params.username || req.body.username;
        var purchase = {
          cost: parseInt(req.body.cost || req.query.cost),
          category: req.body.category || req.query.category,
          location: req.body.location || req.query.location,
          date: req.body.date || req.query.date
        };
        db.deleteIndividualPurchase(username, purchase, function(err, deleted) {
          if (err || !deleted) {res.status(400).send(err);}
          else {res.status(200).end();}
        });
      } else {
        res.status(401).send('You can/t make that unauthenticated request!');
      }
    });
  };
}

function authenticate(req, done) {
  if (req.params.username && req.headers.cookie) {
    authThroughRedisStore(req.params.username, req.headers.cookie, function(err, auth) {
      if (err) {done(err);}
      else {done(null, auth);}
    });
  } else if (req.params.username && req.query.sessionID){
    authThroughRedisStore(`${req.params.username}Desktop`, req.query.sessionID, function(err, auth) {
      if (err) {done(err);}
      else done(null, auth);
    });
  } else if (req.body.username && req.body.password) {
    authThroughDB(req.body.username, req.body.password, function(err, auth) {
      if (err) {done(err);}
      else {done(null, auth);}
    });
  } else {
    done(null, false);
  }
}

function authThroughRedisStore(username, cookie, done) {
  var RedisClient = redis.createClient();
  RedisClient.get(username, function(err, reply) {
    if (err) {RedisClient.end(); done(err);}
    if (replySIDMatchesCookieSID(reply, cookie)) {
      RedisClient.end();
      done(null, true);
    } else {
      RedisClient.end();
      done(null, false);
    }
  });
}

function authThroughDB(username, password, done) {
  db.findByUsername(username, function(err, user, userPassword) {
    if (err) {done(err);}
    else if (!user) {done(null, false);}
    else if (!bcrypt.compareSync(password, userPassword)) {done(null, false);}
    else {done(null, true);}
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

module.exports = APIController;
