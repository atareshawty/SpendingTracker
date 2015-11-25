function setup(app, handlers) {
  	app.get('/', handlers.staticPages.getHome);
	app.get('/401', handlers.staticPages.get401);
	app.get('/', handlers.staticPages.getAbout);
	app.get('/users', handlers.user.getUser);
	app.get('/users/login', handlers.user.getLogin);
	app.get('/users/logout', handlers.user.getLogout);
	app.get('/users/signup', handlers.user.signup);
	app.get('/users/:id', handlers.user.getUser);
	app.post('/users/signup', handlers.user.createUser);
	app.post('/users/login', handlers.user.postLogin);
	app.post('/users/:id', handlers.user.postUser);
}

exports.setup = setup;