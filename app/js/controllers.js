

/* Controllers */
function MeetingListCtrl($scope, socket){
    'use strict';
    socket.on('meetings:update', function(meetings){
       $scope.meetings = meetings.meetings;
    });
    $scope.leave = function(){
        socket.emit('unsubscribe');
    };

    $scope.limit = 10;
}

function HomeCtrl($scope, $location, socket) {
    $scope.create = function(){
        $location.url('/meeting/'+$scope.meetingName);
    };
}

function TimerCtrl($scope, socket,timer){
    'use strict';
    socket.on('timer:init', function(data){
          $scope.timer.reset(data.duration);
      });
    $scope.timer = timer;
    $scope.timerEditDisplay = "partials/timerView.html";
    $scope.start = function(){
        timer.start();
    };
    $scope.stop = function(){
        timer.stop();
    };
    $scope.edit = function(){
        if($scope.timerEditDisplay == "partials/timerEdit.html"){
            $scope.timerEditDisplay = "partials/timerView.html";
        }else{
            $scope.timerEditDisplay = "partials/timerEdit.html";
        }
    };
    $scope.update = function(increment, meetingName){
        timer.setMinutes(increment.amount,meetingName);
        $scope.timerEditDisplay = "partials/timerView.html";
    };
}

function MeetingCtrl($scope, $routeParams, socket, $location, localStorageService) {
    'use strict';
    var meetingNameParam = $routeParams.meetingName || '',
      localStorageUserKey = meetingNameParam + ".user",
      localStorageUser = localStorageService.get(localStorageUserKey);

    $scope.signout = function(){
      localStorageService.remove(localStorageUserKey);
      socket.emit('unsubscribe');
      $location.url('/');
    };

    $scope.deleteMeeting = function(){
      socket.emit('meeting:delete');
    };

    //No Longer needed: suspected
    /*
    if (localStorageUser) {
      socket.emit('unsubscribe');
    }
    */

  socket.emit('subscribe', {
      meetingName: meetingNameParam,
      userName: localStorageUser || ""
  });

  socket.on('meeting:delete', function(){
    socket.emit('unsubscribe');
    $location.url('/');
  });

  $scope.meeting = {phase: 'submit'};
	$scope.topicOrderPrimary = '-voters.length';
  $scope.topicOrderSub = '-topic.id';
	$scope.userTopic = new Topic();
	socket.on('init', function (data)
	{
        $scope.user = data.user;
        $scope.meeting = data.meeting;
        localStorageService.add(localStorageUserKey, data.user.name);
        $scope.meetingPhase = phaseMap[$scope.meeting.phase.name];
        if($scope.meeting.phase.name == 'discuss'){
          $scope.meeting.topics.some(function(topic){
            if(topic.current){
              $scope.currentTopic = topic;
              return true;
            }
          });
					$scope.reloadNotes();
        }
	});

	socket.on('user:join', function(data){
		$scope.meeting.participants.push(data.user);
	});

	socket.on('topic:post', function(data){
		$scope.meeting.topics.push(data.topic);
  });

	socket.on('user:left', function(data){
    if($scope.meeting === undefined){return;}
		var userToRemove = data.user;
		var allUsers = $scope.meeting.participants;
        allUsers.forEach(function(user, index){
            if(userToRemove === user){
                allUsers.splice(index,1);
            }
        });

        $scope.meeting.topics.forEach(function(topic, index){
            if(topic.author == userToRemove){
                $scope.meeting.topics.splice(index, 1);
                return;
            }

            topic.voters.forEach(function(voter, index){
                if(voter == userToRemove){
                    topic.voters.splice(index, 1);
                }
            });
        });

	});

	socket.on('topic:vote', function(data){
		var allTopics = $scope.meeting.topics;
        allTopics.forEach(function(topic, index){
            if(topic.author == data.topic.author && topic.body === data.topic.body){
                allTopics[index] = data.topic;
            }
        });
    if ($scope.user.name === data.voter.name) {
      $scope.user.votesRemaining = data.voter.votesRemaining;
    }
	});

	$scope.sendTopic = function(){
    var topicToPost = new Topic($scope.user.name);
    topicToPost.body = $scope.userTopic.body;
		socket.emit('topic:post',{
			topic: topicToPost
		});
		$scope.userTopic = {};
	};

  socket.on('topic:downvote', function(data) {
    var allTopics = $scope.meeting.topics;
    allTopics.forEach(function(topic, index){
        if(topic.author == data.topic.author && topic.body === data.topic.body){
            allTopics[index] = data.topic;
            if (data.voter.name == $scope.user.name) {
              $scope.user.votesRemaining = data.voter.votesRemaining;
            }
            return;
        }
    });
  });

	$scope.vote = function(topic){
		socket.emit('topic:vote', {
			topic: topic,
			voter: $scope.user
		});
	};

  $scope.downvote = function(topic, index) {
    socket.emit('topic:downvote', {
      topic: topic,
      voter: $scope.user
    });
  };

  $scope.userVotedForThisTopic = function(topic, userName) {
    var userVotedForThisTopic = false;
    topic.voters.forEach(function(voter, user) {
      if (userName === voter.name) {
        userVotedForThisTopic = true;
      }
    });
    return userVotedForThisTopic;
  };

  $scope.calculateVotesRemainingForRoom = function() {
    var currentNumberOfVotesOnTopics = 0;
    var currentNumberOfUsersVotesAvailable = $scope.meeting.participants.length * 3;
    $scope.meeting.topics.forEach(function(topic) {
      if (topic.voters.length > 0) {
        currentNumberOfVotesOnTopics += topic.voters.length;
      }
    });
    return currentNumberOfUsersVotesAvailable - currentNumberOfVotesOnTopics;
  };

	function Topic(author){
		this.body = '';
		this.voters = [];
		this.author = author;
		this.votes = function(){
            return this.voters.length;
        };
	}

  var phaseMap = {
    submit: 'partials/submit.html',
    merge: 'partials/merge.html',
    voting: 'partials/voting.html',
    discuss: 'partials/discuss.html',
    complete: 'partials/email.html'
  };

  $scope.changePhase = function(){
    socket.emit('update:phase');
  };

  $scope.hasContinueVoted = function(){
    var currentTopic = $scope.currentTopic;
    if(!currentTopic) return false;
    var hasVoted = currentTopic.continue.concat(currentTopic.stop).some(function(vote){
      if(vote.user == $scope.user.name)
        return true;
    });
    return hasVoted;
  };

  socket.on('topic:continue', function(data){
    $scope.meeting.topics.some(function(topic, index){
      if(data.topic.id == topic.id && data.topic.id == $scope.currentTopic.id){
        $scope.meeting.topics[index].timer = data.topic.timer;
						$scope.meeting.topics[index].continue = data.topic.continue;
						$scope.meeting.topics[index].stop = data.topic.stop;
    				$scope.currentTopic.timer = $scope.meeting.topics[index].timer;
						$scope.currentTopic.continue = $scope.meeting.topics[index].continue;
						$scope.currentTopic.stop = $scope.meeting.topics[index].stop;
        return true;
      }
    });
  });

  socket.on('topic:current', function(data){
    $scope.meeting.topics.forEach(function(topic){
      if(topic.current) topic.current = false;
      if(topic.id == data.topic.id){
        topic.current = true;
        $scope.currentTopic = topic;
      }
    });
  });

  $scope.nextTopic = function(){
    socket.emit('topic:current');
  };

  $scope.continueVote = function(){
    socket.emit('topic:continue', {
      vote: 'continue'
    });
  };

  $scope.stopVote = function(){
    socket.emit('topic:continue', {
      vote: 'stop'
    });
  };
	
	$scope.saveNote = function(topicId, note){
		var noteKey = meetingNameParam + "." + topicId + ".note";
		localStorageService.add(noteKey, note);
 	};
	
  $scope.reloadNotes = function(){
		
		$scope.meeting.topics.forEach(function(topic){
			var note = localStorageService.get(meetingNameParam + "." + topic.id + ".note");
      if(note){
        topic.notes = note;
      }
    });
		
	}

  socket.on('update:phase', function(data){
    $scope.meeting.phase = data.phase;
    $scope.meetingPhase = phaseMap[data.phase.name];
  });

  //Merge Functionality Starts
  $scope.topicSelected=[];
  $scope.newMergeText = {value:""};

  $scope.topicsSelectedToMerge= function(topic){
    var index= $scope.topicSelected.indexOf(topic);
    if(index==-1){
      $scope.topicSelected.push(topic);
    }else{
      $scope.topicSelected.splice(index, 1);
    }

    var text='';
    angular.forEach($scope.topicSelected, function(value){
     text += value.body+'\n';
    });
    $scope.newMergeText = {
      value:text.trim()
    };
  };

  $scope.mergeTopicsButtonClk = function(){
    var newMergeTopic = new Topic();
    var removedTopics = [];

    var authorArray=[];
    for (var i=0; i<$scope.topicSelected.length; i++) {
     for(var j=0; j<$scope.meeting.topics.length ; j++){
      if($scope.topicSelected[i].body == $scope.meeting.topics[j].body){

        if(authorArray.indexOf($scope.meeting.topics[j].author) == -1) {
         authorArray.push($scope.meeting.topics[j].author);
        }
        removedTopics.push($scope.meeting.topics[j]);
        $scope.meeting.topics.splice(j,1);
      }
      }
    }

   //thread safety issue. This would clobber other people's changes.
   socket.emit('remove:meeting:topics', removedTopics);

   newMergeTopic.body = $scope.newMergeText.value;
   newMergeTopic.author = authorArray.toString();

   socket.emit('topic:post',{
    topic: newMergeTopic
   });

  $scope.topicSelected =[];
  $scope.newMergeText = '';

 };

 socket.on('update:meeting:topics', function(data){
   $scope.meeting.topics=data;
  });

 $scope.cancelMerge = function(){
  //Uncheck all checked checkboxes
  var checkboxes = document.getElementsByName('mergeCheckBoxes');
  for(var i=0, n=checkboxes.length;i<n;i++) {
   checkboxes[i].checked = false;
  }
  $scope.topicSelected =[];
  $scope.newMergeText = '';
 };

  $scope.toggleSelected = function(topic) {
     topic.selected = !topic.selected;
  };
// End
  $scope.email= {
    to : ''
  };

  $scope.sendEmail = function(){
      var emailBody='Hi\n';
      emailBody+='Topics:\n\n';

      for(var p=0;p<$scope.meeting.topics.length;p++){
        var topic = $scope.meeting.topics[p];
        emailBody+='Topic: ';
        emailBody+=topic.body+'\n';
        if(topic.notes){
          emailBody+='Notes: ';
          emailBody+=topic.notes+'\n\n';
        }

      }
      emailBody += '\nThanks';

      var link = "mailto:"+$scope.email.to+
               "?subject=Meeting%20Notes%20MeetingId:%20"+$scope.meeting.name+
               "&body="+escape(emailBody);
      window.location.href = link;
  };

}
