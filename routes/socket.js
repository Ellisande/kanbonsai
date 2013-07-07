var allNames = [
  'Mayor McCheese','Hamburgler','Strawberry Shortcake','Xena, Warrior Princess','Kruul the Warrior King','Hippie','Mr. Drippy',
  'Master Shake','Grimmace','Sailor Moon','Blue','A Fish Called Wonda','Resivior Dog','Marsellus Wallus'
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

var meetings = [];
meetings.push(new ServerMeeting('vri'));

// export function for listening to the socket
module.exports = function (socket) {
  var meeting = meetings[0];
  var name = getNewName(allNames, meeting.participants);
  meeting.participants.push(name);

  // send the new user their name and a list of users
  socket.emit('init', {
    user: name,
    meeting: meeting
  });

  socket.broadcast.emit('user:join', {
    user: name
  });

  socket.on('comment:post', function(data){
    if(indexOfCommentByAuthor(meeting.comments,data.comment.author) != -1){
      return;
    }
    var newComment = data.comment;
    newComment.voters = [];
    meeting.comments.push(newComment);
    socket.broadcast.emit('comment:post', {
        comment: newComment
    });
  });

  socket.on('comment:vote', function(data){
    var poster = data.comment.author;
    var voter = data.voter;
    var comments = meeting.comments;

    for(var i = 0; i < comments.length; i++){
      if(comments[i].author === poster && comments[i].voters.indexOf(voter) === -1){
        comments[i].voters.push(voter);
        socket.broadcast.emit('comment:vote', {
          comment: comments[i],
          voter: voter
        });
        break;
      }
    }


  });

  // validate a user's name change, and broadcast it on success
  socket.on('change:name', function (data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      
      socket.broadcast.emit('change:name', {
        oldName: oldName,
        newName: name
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  // clean up when a user leaves, and broadcast it to other users
  socket.on('disconnect', function () {
    var allUsers = meeting.participants;
    allUsers.splice(allUsers.indexOf(name), 1);

    var comments = meeting.comments;
    for(var i = 0; i < comments.length; i++){
      if(comments[i].author == name){
        comments.splice(i,1);
        continue;
      }

      var containingIndex = comments[i].voters.indexOf(name);
      if(containingIndex !== -1){
        comments[i].voters.splice(containingIndex,1);
      }
    }

    socket.broadcast.emit('user:left', {
      user: name
    });
  });
};
