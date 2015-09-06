var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res) {
  res.render('users', { title: 'Sample User'});
});

router.get('/:id', function(req, res) {
  //User id request matches logged in user id
  if (req.session.passport && req.session.passport.user) {
    if (userMatchesURLReq(req.url, req.session.passport.user.id)) {
      res.render('user', { user: req.user });
    } else {
      res.send('Don\'t try to access another user\'s information!');
    }
  } else {
    res.render('needLogin');
  }
});

router.post('/:id', function(req, res) {
  var transaction = db.spending.createTransaction(req.body.cost, req.body.category, req.body.location);
  console.log('\n\n\n\n\n\n' + req.user.id)
  console.log(req.body + '\n\n\n\n\n\n');
  db.spending.insertTransaction(req.user.id, transaction, function() {
    res.redirect('back');
  });
});

var userMatchesURLReq = function(reqURL, userId) {
  return reqURL == ('/' + userId);
}

module.exports = router;
