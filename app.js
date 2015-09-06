var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var bcrypt = require('bcrypt');
var exphbs  = require('express-handlebars');

var app = express();
var routes = require('./routes/index');
var users = require('./routes/users');
// app.use(favicon(path.join(__dirname, 'public', 'avatar.jpeg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/', routes);
app.use('/users', users);

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (!bcrypt.compareSync(password, user.password)) { return cb(null, false); }
      return cb(null, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  var sessionUser = {id: user.id, username: user.username, spending: user.spending}
  done(null, sessionUser);
});

passport.deserializeUser(function(sessionUser, done) {
  done(null, sessionUser);
});

app.get('/login', function(req, res, next) {
  if(req.session.passport) {
    if(req.session.passport.user) {
      res.redirect('/users/' + req.session.passport.user.id);
    }
  } else {
    res.render('login');
  }
});

app.post('/login',
  passport.authenticate('local', {failureRedirect: '/401'}),
  function(req, res) {
    res.redirect('/users/' + req.user.id);
});

app.get('/logout',
  function(req, res){
    req.session.destroy();
    res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
