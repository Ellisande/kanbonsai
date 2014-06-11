var ServerMeeting = require('./server-meeting');
var model = require('./model');
var meetings = {default: new ServerMeeting('default')};
var User = model.User;
var Vote = model.Vote;
var Topic = model.Topic;
var moment = require('moment');

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
         user = new User(model.getNewName(meeting), meeting.name, socket.id);

        meeting.participants.push(user);
        socket.emit('init', {
            user: user,
            meeting: meeting
        });

        socket.emit('timer:init', {
          duration: meeting.getTimer().asMilliseconds()
        });

        io.sockets.emit('meetings:update', {
          meetings: meetings
        });

        socket.broadcast.to(roomName).emit('user:join', {
            user: user
        });
      };

      var refresh = function(userName, roomName){
        meeting = meetings[roomName] || function(){
            meetings[roomName] = new ServerMeeting(roomName);
            return meetings[roomName];
        }();

        user = new User(userName, meeting.name, socket.id);
        meeting.participants.push(user);

        socket.emit('init', {
            user: user,
            meeting: meeting
        });

        io.sockets.emit('meetings:update', {
          meetings: meetings
        });

        socket.emit('timer:init', {
          duration: meeting.getTimer().asMilliseconds()
        });
      };

      // join a room.
      socket.on('subscribe', function(data){
        socket.join(data.meetingName);
        roomName = data.meetingName;
        if (data.userName) {
          refresh(data.userName, data.meetingName);
        } else {
          initialize(data.meetingName);
        }
      });

      // event to save and broadcast out when a user adds a comment.
      socket.on('topic:post', function(data){
        var newTopic = new Topic(data.topic);
        meeting.topics.push(newTopic);
        io.sockets.in(roomName).emit('topic:post', {
            topic: newTopic
        });
      });

      socket.on('topic:continue', function(data){
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
        var duration = moment().add(meeting.getTimer());
        io.sockets.in(roomName).emit('timer:start', {
            duration: meeting.getTimer().asMilliseconds()
        });
      });

      socket.on('timer:stop', function(){
        if(meeting.phase.name == 'discuss' && meeting.getCurrentTopic()){
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
        socket.leave(roomName);

        var allUsers = meeting.participants || [];
        for(var i = 0; i < allUsers.length; i++){
          allUsers.splice(allUsers[i].name.indexOf(user.name), 1);
        }

        io.sockets.in(roomName).emit('user:left', {
          user: user
        });

        roomName = "default";
        meeting = meetings["default"];

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
}

module.exports = socket;
