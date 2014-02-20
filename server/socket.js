var ServerMeeting = require('./server-meeting');
var model = require('./model');
var meetings = {default: new ServerMeeting('default')};
// export function for listening to the socket
var socket = function(io){
  return function (socket) {
      var meeting = meetings.default;
      var name = "";
      var roomName = "";


      // send the new user their name and a list of users
      var initialize = function(){
        meeting = meetings[roomName] || function(){meetings[roomName] = new ServerMeeting(roomName); return meetings[roomName];}();
        name = model.getNewName(meeting.participants);
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
}

module.exports = socket;

