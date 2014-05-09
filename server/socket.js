var ServerMeeting = require('./server-meeting');
var model = require('./model');
var meetings = {default: new ServerMeeting('default')};

var socket = function(io){
  return function (socket) {
      var meeting = meetings.default;
      var user = "";
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
        user = model.getNewName(meeting);
        meeting.participants.push(user.name);
//        io.of('').clients('unit').forEach(function(client){console.log(client.id)});
        socket.emit('init', {
            user: user,
            meeting: meeting
        });

        io.sockets.emit('meetings:update', {
          meetings: meetings
        });

        socket.broadcast.to(roomName).emit('user:join', {
            user: user
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

      //@Merge, Edit Comments
      socket.on('update:meeting:comments', function(data){
        io.sockets.in(roomName).emit('update:meeting:comments', data);
      });

       //@Highlight selected row
      socket.on('highlight:selected:row', function(data){
        io.sockets.in(roomName).emit('highlight:selected:row', data);
      });

       //@Highlight selected row
      socket.on('host:toggle', function(userData){
        io.sockets.in(roomName).emit('host:toggled', userData);
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
        allUsers.splice(allUsers.indexOf(user.name), 1);

        var comments = meeting.comments;
        var totalComments = comments.length;
        for(var i = 0; i < totalComments; i++){
          if(comments[i].author === user.name){
            comments.splice(i,1);
            i--;
            totalComments--;
            continue;
          }

          var containingIndex = comments[i].voters.indexOf(user.name);
          if(containingIndex !== -1){
            comments[i].voters.splice(containingIndex,1);
          }
        }

        io.sockets.in(roomName).emit('user:left', {
          user: user
        });

        roomName = "default";
        meeting = meetings["default"];

      }

      // clean up when a user leaves, and broadcast it to other users
      socket.on('unsubscribe', unsubscribe);
      socket.on('disconnect', unsubscribe);

      socket.on('update:phase', function(){
        meeting.nextPhase();
        io.sockets.in(roomName).emit('update:phase', {
          phase: meeting.phase
        });
      });
    };
}

module.exports = socket;
