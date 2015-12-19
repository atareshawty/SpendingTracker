var express = require('express');
var router = express.Router();
var passport = require('passport');

router.setup = function(app, handlers) {
  app.get('/', handlers.pages.getHome);
	app.get('/401', handlers.pages.get401);
	app.get('/about', handlers.pages.getAbout);
	app.get('/users', handlers.pages.getSampleUser);
	app.get('/users/login', handlers.pages.getLogin);
	app.get('/users/logout', handlers.pages.getLogout);
	app.get('/users/signup', handlers.pages.getSignup);
	app.get('/users/:id', handlers.pages.getUser);
	app.post('/users/signup', handlers.pages.createUser);
	app.post('/users/login', passport.authenticate('local', {failureRedirect: '/401'}), handlers.pages.postLogin);
	app.post('/users/:id', handlers.pages.postUser);
	app.delete('/users/:id', handlers.pages.deleteUser);
	app.get('/api/users/:id', handlers.api.getUser);
	app.post('/api/users', handlers.api.createUser);
	app.post('/api/users/:id', handlers.api.updateUser);
	app.delete('/api/users/:id', handlers.api.deleteUser);
}

module.exports = router;
