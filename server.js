/* global process */
/* global __dirname */
var express = require('express');
var app = express();
var StaticPagesController = require('./controllers/StaticPagesController');
var UsersController = require('./controllers/UsersController');
var SessionsController = require('./controllers/SessionsController');
var SpendingController = require('./controllers/SpendingController');
var APIController = require('./controllers/APIController');
var routes = require('./routes/routes');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var exphbs = require('express-handlebars');
var db = require('./db/users.js');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config.js');
var flash = require('connect-flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: process.env.PASSPORT_SECRET || config.passport.secret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/', routes);
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
  user.total = user.getTotalSpending();
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