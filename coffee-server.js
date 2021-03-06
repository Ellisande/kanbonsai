
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var morgan = require('morgan');
var User = require('./server/model.js').User;

//Stuff
// Hook Socket.io into Express
var io = require('socket.io').listen(app, {log: false});
//var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.use(express.static(__dirname + '/app'));
  app.use('/static', express.static(__dirname + '/build'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(morgan()); // { stream: filestream }
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var socket = require('./server/socket')(io);
io.on('connection', socket);

app.settings.env = 'production';
app.listen(5000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
