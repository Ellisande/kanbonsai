var ServerMeeting = require('./server-meeting');
var model = require('./model');
var meetings = {};
var User = model.User;
var Vote = model.Vote;
var Topic = model.Topic;
var moment = require('moment');

var socket = function(io){

  return function (socket) {
      // This function will execute when a user connects. A user connects any time a
      // socket is created. This includes the normal case and when a user refreshes
      // their browser.
      var meeting;
      var user = "";
      var roomName;

      // A user has just connected, let them know what meetings are here.
      socket.emit('meetings:update',{
        meetings: meetings
      });

      var preInitialize = function() {
          // Create a the meeting if it does not exist already.
          meeting = meetings[roomName] || function(){
              meetings[roomName] = new ServerMeeting(roomName);
              return meetings[roomName];
          }();
      };

      var postInitialize = function(aUser) {
        // Create the user object.
        user = aUser.name;
        // Let your client know your user and meeting objects.
        socket.emit('init', {
            user: aUser,
            meeting: meeting
        });

        // Let your client know the status of the meeting timer.
        socket.emit('timer:init', {
          duration: meeting.getTimer().asMilliseconds()
        });

        // Let all clients know what meetings there are.
        io.sockets.emit('meetings:update', {
          meetings: meetings
        });
      };

      // send the new user their name and a list of users
      var initialize = function(){
          preInitialize(aUser, roomName); // meeting is created
          var aUser = new User(model.getNewName(meeting), roomName, socket.id);
          meeting.participants.push(aUser);
          postInitialize(aUser);
          // Unlike the case where the browser knows what meeting you are in,
          // this method needs to let all users in the room know you have
          // just joined.
          socket.broadcast.to(roomName).emit('user:join', {
              user: aUser
          });
      };

      var refresh = function(userName){
          if(!meeting) return initialize();
          preInitialize(roomName);
          var aUser = meeting.getParticipant(userName);
          postInitialize(aUser);
      };

      // join a room.
      socket.on('subscribe', function(data){
          console.log("Joining room " + data.meetingName);
        roomName = data.meetingName || "default";
        socket.join(roomName);
        if (data.userName) {
          refresh(data.userName);
        } else {
          initialize();
        }
      });

      // event to save and broadcast out when a user adds a comment.
      socket.on('topic:post', function(data){
        if(!meeting) return;
        var newTopic = new Topic(data.topic);
        meeting.topics.push(newTopic);
        io.sockets.in(roomName).emit('topic:post', {
            topic: newTopic
        });
      });

      socket.on('topic:continue', function(data){
        if(!meeting) return;
        var topic = meeting.getCurrentTopic();
        if(!topic) return;
        var vote = new Vote(data.vote, user);
        if(!topic.hasContinueVoted(user)){
          topic.addContinueVote(vote);
          io.sockets.in(roomName).emit('topic:continue', {
            topic: topic
          });
        }
      });

      socket.on('topic:current', function(){
        var newCurrentTopic = meeting.nextTopic();
        io.sockets.in(roomName).emit('topic:current', {
          topic: newCurrentTopic
        });
        io.sockets.in(roomName).emit('timer:init', {
          duration: meeting.getTimer().asMilliseconds()
        });
      });

      //@REMOVE EDITTED OR MERGE TOPIC
      socket.on('remove:meeting:topics', function(data){
        data.forEach(function(topic) {
            for(var i = meeting.topics.length-1; i >= 0; i--) {
              if (topic.id == meeting.topics[i].id) {
                meeting.topics.splice(i,1);
              }
            }
        });

        io.sockets.in(roomName).emit('update:meeting:topics', meeting.topics);
      });

       //@Toggle Host
      socket.on('host:toggle', function(userData){
        user.isHost = !user.isHost;
        io.sockets.in(roomName).emit('host:toggled', userData);
      });

      // event to save and broadcast out when a user votes up a comment.
      socket.on('topic:vote', function(data){
        var voter = data.voter;
        var topics = meeting.topics;

        topics.forEach(function(topic){
            if(isTopicSame(topic, data.topic)){
                if(topic.voters.indexOf(voter) == -1){
                    topic.voters.push(voter);
                    voter.votesRemaining--;
                    io.sockets.in(roomName).emit('topic:vote', {
                      topic: topic,
                      voter: voter
                    });
                }
            }
        });
      });

      // event to save and broadcast when a user down votes a comment.
      socket.on('topic:downvote', function(data) {
        var thisVoter = data.voter;
        var thisTopic = data.topic;
        meeting.topics.forEach(function(topic) {
          if (isTopicSame(thisTopic, topic)) {
            topic.voters.some(function(currentVoter, index) {
              if (thisVoter.name === currentVoter.name) {
                topic.voters.splice(index, 1);
                thisVoter.votesRemaining++;
                io.sockets.in(roomName).emit('topic:downvote', {
                  topic: topic,
                  voter: thisVoter
                });
                return true;
              }
            });
          }
        });
      });

      function isTopicSame(firstTopic, secondTopic) {
        return firstTopic.id === secondTopic.id;
      }

      socket.on('timer:start', function(data){
        if(!meeting) return;
        var duration = moment().add(meeting.getTimer());
        io.sockets.in(roomName).emit('timer:start', {
            duration: meeting.getTimer().asMilliseconds()
        });
      });

      socket.on('timer:stop', function(){
        if(!meeting && meeting.phase.name == 'discuss' && meeting.getCurrentTopic()){
          meeting.getCurrentTopic().reset();
          io.sockets.in(roomName).emit('topic:continue', {
            topic: meeting.getCurrentTopic()
          });
        }
        io.sockets.in(roomName).emit('timer:stop', {
          duration: meeting.getTimer().asMilliseconds()
        });
      });

      var unsubscribe = function () {
          console.log(user + " is leaving " + roomName);
          socket.leave(roomName);

          if (user && meeting) {
              // Set status of user in user object
              var meetingAbandoned = meeting.disconnect(user);
              if (meetingAbandoned) {
                  delete meetings[roomName];
              }
          }

          io.sockets.emit('meetings:update', {
            meetings: meetings
          });

          meeting = null;
          roomName = null;
      };

      // clean up when a user leaves, and broadcast it to other users
      socket.on('unsubscribe', unsubscribe);
      socket.on('disconnect', unsubscribe);

      socket.on('update:phase', function(){
        meeting.nextPhase();
        io.sockets.in(roomName).emit('update:phase', {
          phase: meeting.phase
        });
        if(meeting.phase.name == 'discuss'){
          meeting.nextTopic();
          io.sockets.in(roomName).emit('topic:current', {
            topic: meeting.getCurrentTopic()
          });
        }
        io.sockets.in(roomName).emit('timer:init', {
          duration: meeting.getTimer().asMilliseconds()
        });
      });
    };
};

module.exports = socket;
