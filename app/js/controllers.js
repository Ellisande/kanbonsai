

/* Controllers */
function MeetingListCtrl($scope, socket){
    'use strict';
    socket.global('meetings:update', function(meetings){
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

function TimerCtrl($scope, timerService){
    'use strict';
    $scope.duration = moment.duration(0);
    $scope.timer = timerService($scope);
    $scope.start = function(){
        $scope.timer.start(180000);
    };
    $scope.stop = function(){
        $scope.timer.stop();
    };
}

function LocalTimerCtrl($scope, localTimer){
    'use strict';
    $scope.duration = moment.duration(0);
    $scope.timer = localTimer($scope);
    $scope.start = function(){
        $scope.timer.start(180000);
    };
    $scope.stop = function(){
        $scope.timer.stop();
    };
}

function MeetingCtrl($scope, $routeParams, socket, snapshot, $location, mtgDetails) {
  'use strict';
  socket.cleanup();

  socket.emit('unsubscribe');
  socket.emit('subscribe', {
      name: $routeParams.meetingName
  });

  $scope.meeting = {phase: 'submit'};
	$scope.topicOrder = '-voters.length';
	$scope.userTopic = new Topic();
	socket.on('init', function (data)
	{
        $scope.user = data.user;
        $scope.meeting = data.meeting;
        $scope.meetingPhase = data.meeting.phase;
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

  $scope.unvote = function(topic, index) {
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

  $scope.meetingPhase = phaseMap[$scope.meeting.phase];

  $scope.changePhase = function(){
    socket.emit('update:phase');
  };

  socket.on('update:phase', function(data){
    $scope.meeting.phase = data.phase;
    $scope.meetingPhase = phaseMap[data.phase.name];
  });

  //Merge Functionality Starts
  $scope.topicSelected=[];
  $scope.topicsSelectedToMerge= function(topic){
    var index= $scope.topicSelected.indexOf(topic);
    if(index==-1){
      $scope.topicSelected.push(topic);
    }else{
      $scope.topicSelected.splice(index, 1);
    }

    var text='';
    angular.forEach($scope.topicSelected, function(value){
     text+=value.body+'\n';
    });

    $scope.newMergeText = text.trim();
  };

  $scope.mergeTopicsButtonClk = function(){
    var copyFirstMatchTopic={
       author:'',
       body:''
    };
    var authorArray=[];
    for (var i=0; i<$scope.topicSelected.length; i++) {
     for(var j=0; j<$scope.meeting.topics.length ; j++){
      if($scope.topicSelected[i].body == $scope.meeting.topics[j].body){

        if(authorArray.indexOf($scope.meeting.topics[j].author) == -1) {
         authorArray.push($scope.meeting.topics[j].author);
        }
        $scope.meeting.topics.splice(j,1);
      }
      }
    }
  copyFirstMatchTopic.body = $scope.newMergeText;
  copyFirstMatchTopic.author = authorArray.toString();
  $scope.topicSelected =[];
  $scope.newMergeText = '';
  $scope.meeting.topics.push(copyFirstMatchTopic);
  //thread safety issue. This would clobber other people's changes.
  socket.emit('update:meeting:topics', $scope.meeting.topics);
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
// Merge Fuctionality Ends

  // Selected row hightlighted
  socket.on('highlight:selected:row', function(topic){
  for(var j=0; j<$scope.meeting.topics.length ; j++){
    if($scope.meeting.topics[j].body == topic.body){
        $scope.meeting.topics[j] = topic;
    }else{
     $scope.meeting.topics[j].selected = '';
    }
  }
  });

  $scope.setSelected = function(topic) {
     topic.selected = 'selected';
     socket.emit('highlight:selected:row', topic);
  };
// End
}

function MergeCtrl($scope, $routeParams, socket, mtgDetails) {
    'use strict';



}
