var express = require('express');
var router = express.Router();
var passport = require('passport');

router.setup = function(app, controllers) {
  //Static Pages Controller
  app.get('/', controllers.staticPages.home);
  app.get('/401', controllers.staticPages.get401);

  //Users Controller
  app.get('/signup', controllers.users.new);
  app.post('/users/create', controllers.users.create);
  app.get('/users', controllers.users.show);
  app.get('/users/:username', controllers.users.show);

  //Sessions Controller
  app.get('/login', controllers.session.loginPage);
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login?auth=false', failureFlash: true}), controllers.session.create);
  app.post('/logout', controllers.session.destroy);
  
  //API Controller
  app.get('/api/users/:username', controllers.api.getUser);
  app.get('/api/spending/:username', controllers.api.getSpending);
  app.post('/api/spending/:username', controllers.api.newSpending);
  app.post('/api/category/:username', controllers.api.newCategory);
  app.delete('/api/spending/:username', controllers.api.deletePurchase);
}

module.exports = router;
