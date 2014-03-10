var ServerMeeting = require('./server-meeting');
var model = require('./model');
var meetings = {default: new ServerMeeting('default')};

var socket = function(io){
  return function (socket) {
      var meeting = meetings.default;
      var name = "";
      var roomName = "default";

      socket.emit('meetings:update',{
        meetings: meetings
      });
      // send the new user their name and a list of users
      var initialize = function(roomName){
        meeting = meetings[roomName] || function(){
            meetings[roomName] = new ServerMeeting(roomName); 
            return meetings[roomName];
        }();
        name = model.getNewName(meeting.participants);
        meeting.participants.push(name);
//        io.of('').clients('unit').forEach(function(client){console.log(client.id)});
        socket.emit('init', {
            user: name,
            meeting: meeting
        });

        io.sockets.emit('meetings:update', {
          meetings: meetings
        });
          
        socket.broadcast.to(roomName).emit('user:join', {
            user: name
        });
      };

      // join a room.
      socket.on('subscribe', function(data){
        socket.join(data.name);
        roomName = data.name;
        initialize(data.name);
      });

      // event to save and broadcast out when a user adds a comment.
      socket.on('comment:post', function(data){
        var newComment = data.comment;
        newComment.voters = [];
        meeting.comments.push(newComment);
        io.sockets.in(roomName).emit('comment:post', {
            comment: newComment
        });
//        io.of('').clients('unit').forEach(function(client){console.log(client.id)});
      });

      // event to save and broadcast out when a user votes up a comment.
      socket.on('comment:vote', function(data){
        var poster = data.comment.author;
        var voter = data.voter;
        var comments = meeting.comments;

        comments.forEach(function(comment){
            if(comment.author === poster && comment.status === data.comment.status){
                if(comment.voters.indexOf(voter) == -1){
                    comment.voters.push(voter);
                    io.sockets.in(roomName).emit('comment:vote', {
                      comment: comment,
                      voter: voter
                    });
                }
            }
        });  
      });
      
      socket.on('timer:start', function(data){
        meeting.timer.endTime = new Date().getTime()+data.duration;
        io.sockets.in(roomName).emit('timer:start', {
            duration: data.duration
        });
      });
      
      socket.on('timer:stop', function(){
        io.sockets.in(roomName).emit('timer:stop', {});
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

        roomName = "default";
        meeting = meetings["default"];
        
      }
      
      // clean up when a user leaves, and broadcast it to other users
      socket.on('unsubscribe', unsubscribe);
      socket.on('disconnect', unsubscribe);
    };
}

module.exports = socket;

