var db = require('../db/users.js');

function APIController() {
  this.getUser = function(req,res) {
    var username = req.user.username || req.body.username;
    db.findByUsername(username, function(err, user) {
      res.json(user);
    });
  };
}

module.exports = APIController;