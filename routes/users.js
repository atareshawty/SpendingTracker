var express = require('express');
var router = express.Router();
var db = require('../db')

router.get('/', function(req, res) {
  if(req.session.passport) {
      if(req.session.passport.user) {
        res.redirect('/users/' + req.session.passport.user.id);
      }
    } else {
      res.render('users', { title: 'Sample User'});
  }
});

router.get('/:id', function(req, res) {
  //User id request matches logged in user id
  if (isValidSession(req)) {
    if (isValidLogin(req)) {
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
  db.spending.insertTransaction(req.user.id, transaction, function() {
    res.redirect('back');
  });
});

var userMatchesURLReq = function(reqURL, userId) {
  return reqURL == ('/' + userId);
}

function isValidSession(req) {
  return !(req.session.passport == null || req.session.passport.user == null);
}

function isValidLogin(req) {
  return userMatchesURLReq(req.url, req.session.passport.user.id);
}

module.exports = router;
