
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./server');

var app = module.exports = express.createServer();

// Hook Socket.io into Express
//var io = require('socket.io').listen(app, {log: false});
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.use(express.static(__dirname + '/app'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var socket = require('./server/socket')(io);
io.on('connection', socket);

app.settings.env = 'production';
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
