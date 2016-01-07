var db = require('../db/users.js');
var bcrypt = require('bcrypt-nodejs');

function APIController() {
  this.getUser = function(req, res) {
    var username = req.user ? req.user.username : req.body.username;
    var password = req.body.password
    if (req.params.username === username) {
      if (req.isAuthenticated()) {
        respondJSON(username, res);
      } else {
        db.findByUsername(username, function(err, user, userPassword) {
          if (err) {
            res.status(500).send(err.message);
          } else if (!user) {
            res.send('User not found');
          } else if (!bcrypt.compareSync(password, userPassword)) {
            res.status(401).send('Username and password don\'t match');
          } else {
            res.json(user);
          } 
          res.end();
        });
      }
    } else {
      res.send('Don\'t try to access someone else\'s information!');
    }
  };
}

function respondJSON(username, response) {
  db.findByUsername(username, function(err, user) {
    if (err) {
      response.send(err.message);
    } else {
      response.json(user);
      response.end();
    }
  });
}

module.exports = APIController;