var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Sample User'});
});

router.get('/:id', function(req, res, next) {
  res.send('You\'ve accessed user: ' + req.params.id);
});

module.exports = router;
