var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
router.use(function(req, res, next) {
  console.log('\n\nGot a request!!\n\n');
  next();
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Track My Spending' });
});

router.post('/login', function(req, res, next) {
  console.log(req);
  res.send('Stuff...');
})

module.exports = router;
