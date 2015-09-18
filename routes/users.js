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
  if (isValidSession(req)) {
    if (isValidLogin(req)) {
      if (req.query.from) {
        console.log('Made it to url query logic');
        db.users.getUserFilterDate(req.user.id, req.query.from, req.query.To, function(err, spending, total) {
          if (!err) {
            req.user.spending = spending;
            req.user.total = total;
            res.render('user', {user: req.user});
          } else {
            res.send('Database error');
          }
        });
      } else {
        res.render('user', { user: req.user });
      }
    } else {
      res.send('Don\'t try to access another user\'s information!');
    }
  } else {
    res.render('needLogin');
  }
});

router.post('/:id', function(req, res) {
  var transaction = db.spending.createTransaction(req.body.cost, req.body.category, req.body.location, req.body.date);
  db.spending.insertTransaction(req.user.id, transaction, function() {
    res.redirect('back');
  });
});

function userMatchesURLReq(reqURL, userId) {
  var questionMarkIndex = reqURL.indexOf('?');
  var id;
  if (questionMarkIndex >= 0) {
    id = reqURL.substring(1, questionMarkIndex);
  } else {
    id = reqURL.substring(1, reqURL.length);
  }
  return id == userId;
}

function isValidSession(req) {
  return !(req.session.passport == null || req.session.passport.user == null);
}

function isValidLogin(req) {
  return userMatchesURLReq(req.url, req.session.passport.user.id);
}

function urlHasQuery(req) {
  return Object.keys(req.query).length === 0;
}

module.exports = router;