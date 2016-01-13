/* global process */
/* global __dirname */
var express = require('express');
var app = express();
//Controllers
var StaticPagesController = require('./controllers/StaticPagesController');
var UsersController = require('./controllers/UsersController');
var SessionsController = require('./controllers/SessionsController');
var SpendingController = require('./controllers/SpendingController');
var APIController = require('./controllers/APIController');
//Routes
var routes = require('./routes/routes');
//Passport for authentication
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
//Database interaction
var db = require('./db/users.js');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');
var flash = require('connect-flash');
var session = require('express-session');
//Session store
var RedisStore = require('connect-redis')(session);
var Redis = require('redis');

//Uses json and url encoded form body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Session configuration
app.use(session( {
  secret: process.env.PASSPORT_SECRET || config.passport.secret,
  resave: false,
  store: new RedisStore( {
    client: Redis.createClient()
  }),
  saveUninitialized: false,
  cookie: {
    httpOnly: false
  }
}));

//Parse cookies with same secret as session
app.use(cookieParser(process.env.PASSPORT_SECRET || config.passport.secret));

//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set up passport
app.use(passport.initialize());
app.use(passport.session());

//Sets handlebars view engine for server side html rendering
app.set('view engine', 'ejs');

//Routes
app.use('/', routes);

//Flash messages
app.use(flash());

//Local Authentication Strategy
passport.use(new Strategy(
  function(username, password, cb) {
    db.findByUsername(username, function(err, user, userPassword) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (!bcrypt.compareSync(password, userPassword)) { return cb(null, false); }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(sessionUser, done) {
  done(null, sessionUser);
});

var controllers = {
  staticPages: new StaticPagesController(),
  users: new UsersController(),
  session: new SessionsController(),
  spending: new SpendingController(),
  api: new APIController()
};

var server;

function start() {
  routes.setup(app, controllers);
  var port = config.server.port;
  server = app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

function end() {
  server.close();
}

exports.end = end;
exports.start = start;
exports.app = app;