var express = require('express');
var router = express.Router();
var passport = require('passport');
var db = require('../db/users.js');

router.get('/', function(req, res) {
  res.render('home');
});

router.get('/401', function(req, res) {
  res.render('401');
});

router.get('/about', function(req, res) {
  res.render('about');
});

module.exports = router;
