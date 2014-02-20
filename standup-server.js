
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes');
//  socket = require('./routes/socket.js');

var app = module.exports = express.createServer();

// Hook Socket.io into Express
var io = require('socket.io').listen(app, {log: false});
//var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

// app.get('/', function(req, res){
// 	res.render('partials/home');
// });
// app.get('/:name', function(req, res){
// 	var name = req.params.name;
// 	res.render('partials/'+name);
// });

// // redirect all others to the index (HTML5 history)
// app.get('*', routes.index);

// Socket.io Communication

var allNames = [
  'Mayor McCheese','Hamburgler','Strawberry Shortcake','Xena, Warrior Princess','Kruul the Warrior King','Hippie','Mr. Drippy',
  'Master Shake','Grimmace','Sailor Moon','Blue','A Fish Called Wonda','Resivior Dog','Marsellus Wallus',"Tony Stark","Justin Beiber",
  'Bubble Puppy','Dora the Explorer','Spongebob Squarepants','Moonpie','Smores','Onyx','Uncle Bob','Godzilla',
  'McLovin','Sparky, the Fire Breathing Chameleon','The Tin Man', 'Magic Mike', 'Squared', 'MD', 'Darth Helemet', 'President Scroob',
  'Glass Popcorn'
];

var randomName = function(allNames){
  return allNames[Math.floor((Math.random()*allNames.length))];
};

function isNameFree(name, participants){
  return participants.indexOf(name) == -1;
}

function getNewName(allNames, participants){
  var name;
  do{
    name = randomName(allNames);
  } while (!isNameFree(name, participants))

  return name;
}

function ServerMeeting(name){
  var moment = require('moment');
  this.name = name;
  this.userIds = 1;
  this.commentIds = 1;
  this.participants = [];
  this.comments = [];
  this.startTime = moment(new Date()).add('minutes',15);

  // serialize claimed names as an array
  this.getAllNames = function () {
    return this.participants;
  };

  this.addComment = function(comment){
    this.comments.push(comment);
  };

  this.removeComment = function(comment){
    delete this.comments[comment];
  };

  this.getAllComments = function(){
    var res = [];
    for(comment in this.comments){
      res.push(comment);
    }

    return res;
  };
}

function indexOfCommentByAuthor(comments, author){
  for(var i = 0; i < comments.length; i++){
    if(comments[i].author === author){
      return i;
    }
  }

  return -1;
}

var meetings = {default: new ServerMeeting('default')};

// export function for listening to the socket
var socket = function (socket) {
  var meeting = meetings.default;
  var name = "";
  var roomName = "";


  // send the new user their name and a list of users
  var initialize = function(){
    meeting = meetings[roomName] || function(){meetings[roomName] = new ServerMeeting(roomName); return meetings[roomName];}();
    name = getNewName(allNames, meeting.participants);
    meeting.participants.push(name);
    socket.emit('init', {
        user: name,
        meeting: meeting
    });

    socket.broadcast.to(roomName).emit('user:join', {
        user: name
    });
  };
  
  socket.on('subscribe', function(data){
    socket.join(data.name);
    roomName = data.name;
    initialize(data.name);
  });
    
  socket.on('comment:post', function(data){
    var newComment = data.comment;
    newComment.voters = [];
    meeting.comments.push(newComment);
    io.sockets.in(roomName).emit('comment:post', {
        comment: newComment
    });
  });

  socket.on('comment:vote', function(data){
    var poster = data.comment.author;
    var voter = data.voter;
    var comments = meeting.comments;

    for(var i = 0; i < comments.length; i++){
      if(comments[i].author === poster && comments[i].status === data.comment.status){
        comments[i].voters.push(voter);
        io.sockets.in(roomName).emit('comment:vote', {
          comment: comments[i],
          voter: voter
        });
        break;
      }
    }


  });

  var unsubscribe = function () {
    socket.leave(roomName);
      
    var allUsers = meeting.participants || [];
    allUsers.splice(allUsers.indexOf(name), 1);

    var comments = meeting.comments;
    var totalComments = comments.length;
    for(var i = 0; i < totalComments; i++){
      if(comments[i].author === name){
        comments.splice(i,1);
        i--;
        totalComments--;
        continue;
      }

      var containingIndex = comments[i].voters.indexOf(name);
      if(containingIndex !== -1){
        comments[i].voters.splice(containingIndex,1);
      }
    }
      
    io.sockets.in(roomName).emit('user:left', {
      user: name
    });


  }
  // clean up when a user leaves, and broadcast it to other users
  socket.on('unsubscribe', unsubscribe);
    
  socket.on('disconnect', unsubscribe);
};

io.on('connection', socket);

app.settings.env = 'production';
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
