var express = require('express');
var router = express.Router();
var passport = require('passport');

router.setup = function(app, controllers) {
  //Static Pages Controller
  app.get('/', controllers.staticPages.home);
  app.get('/about', controllers.staticPages.about);
  app.get('/401', controllers.staticPages.get401);

  //Users Controller
  app.get('/signup', controllers.users.new);
  app.post('/users/create', controllers.users.create);
  app.get('/users', controllers.users.show);
  app.get('/users/:id', controllers.users.show);

  //Sessions Controller
  app.get('/login', controllers.session.loginPage);
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}), controllers.session.create);
  app.post('/logout', controllers.session.destroy);

  //Spending Controller
  app.post('/spending/purchase', controllers.spending.newPurchase);
  app.post('/spending/category', controllers.spending.newCategory);
}

module.exports = router;
