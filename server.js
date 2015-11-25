var express = require('express');
var app = express();
var StaticHandler = require('./handlers/StaticHandler');
var UserHandler = require('./handlers/UserHandler');
var routes = require('./Routes');
var fs = require('fs');

app.configure(function(){
  app.use(express.logger({stream: expressLogFile}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
  app.use(express.errorHandler());
});

var handlers = {
  staticPages: new StaticHandler(),
  user: new UserHandler() 
};

function start() {
  routes.setup(app, handlers);
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
}

exports.start = start;
exports.app = app;