

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
//        $scope.timer.start(20000);
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
//        $scope.timer.start(20000);
    };
    $scope.stop = function(){
        $scope.timer.stop();
    };
}

function SnapshotCtrl($scope, snapshot){
    'use strict';
	var meeting = snapshot.get();
    $scope.snapshot = {};
	$scope.snapshot.comments = meeting;
    $scope.snapshot.commentOrder = '-voters.length';
}


function MeetingCtrl($scope, $routeParams, socket, snapshot, $location, mtgDetails) {
    'use strict';
    socket.cleanup();

    socket.emit('unsubscribe');
    socket.emit('subscribe', {
        name: $routeParams.meetingName
    });
  $scope.meeting = {phase: 'submit'};
	$scope.commentOrder = '-voters.length';
	$scope.userComment = new Comment();
	socket.on('init', function (data)
	{
        $scope.user = data.user;
        $scope.meeting = data.meeting;
	});

	socket.on('user:join', function(data){
		$scope.meeting.participants.push(data.user.name);
	});

	socket.on('comment:post', function(data){
        //console.log('Got a comment');
		$scope.meeting.comments.push(data.comment);
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

        $scope.meeting.comments.forEach(function(comment, index){
            if(comment.author == userToRemove){
                $scope.meeting.comments.splice(index, 1);
                return;
            }

            comment.voters.forEach(function(voter, index){
                if(voter == userToRemove){
                    comment.voters.splice(index, 1);
                }
            });
        });

	});

	socket.on('comment:vote', function(data){
		var allComments = $scope.meeting.comments;
        allComments.forEach(function(comment, index){
            if(comment.author == data.comment.author && comment.status === data.comment.status){
                allComments[index] = data.comment;
            }
        });
	});

	$scope.sendComment = function(){
		var commentToPost = $scope.userComment;
		commentToPost.author = $scope.user.name;
		commentToPost.voters = [];
		socket.emit('comment:post',{
			comment: commentToPost
		});
		$scope.userComment = {};
	};

	$scope.vote = function(comment){
		var voter = $scope.user;
		socket.emit('comment:vote', {
			comment: comment,
			voter: voter
		});
	};

	$scope.snapshot = function(){
		snapshot.grab($scope.meeting.comments);
        socket.emit('unsubscribe');
        $location.url('snapshot');
	};

	function Comment(author){
		this.status = '';
		this.voters = [];
		this.author = author;
		this.votes = function(){
            return this.voters.length;
        };
	}


	$scope.mergeView = function(){
        console.log("o $scope.user : "+$scope.user);
		mtgDetails.captureDetails($scope.meeting, $scope.user);
        $location.url('merge');
	};

  var phaseMap = {
    submit: 'partials/submit.html',
    merge: 'partials/merge.html',
    voting: 'partials/voting.html',
    discuss: 'partials/discuss.html',
    complete: 'partials/email.html'
  };

  $scope.meetingPhase = phaseMap.submit;
  $scope.$watch('meeting.phase', function(){
    $scope.meethingPhase = phaseMap[$scope.meeting.phase];
  });
  $scope.changePhase = function(){
    socket.emit('update:phase');
  };

  socket.on('update:phase', function(data){
    $scope.meeting.phase = data.phase;
    $scope.meetingPhase = phaseMap[data.phase.name];
  });

  //Merge Functionality Starts
  $scope.topicSelected=[];
  $scope.topicsSelectedToMerge= function(comment){
  var index= $scope.topicSelected.indexOf(comment);
  if(index==-1){
    $scope.topicSelected.push(comment);
  }else{
    $scope.topicSelected.splice(index, 1);
  }

  var text='';
  angular.forEach($scope.topicSelected, function(value){
   text = text + value.status +"\n";
  });
  $scope.newMergeText = text;
  };

  $scope.mergeTopicsButtonClk = function(){
    var copyFirstMatchComment={
       author:'',
       status:''
    };
    var authorArray=[];
    for (var i=0; i<$scope.topicSelected.length; i++) {
     for(var j=0; j<$scope.meeting.comments.length ; j++){
      if($scope.topicSelected[i].status == $scope.meeting.comments[j].status){

        if(authorArray.indexOf($scope.meeting.comments[j].author) == -1) {
         authorArray.push($scope.meeting.comments[j].author);
        }
        $scope.meeting.comments.splice(j,1);
      }
      }
    }
  copyFirstMatchComment.status = $scope.newMergeText;
  copyFirstMatchComment.author = authorArray.toString();
  $scope.topicSelected =[];
  $scope.newMergeText = '';
  $scope.meeting.comments.push(copyFirstMatchComment);
  //thread safety issue. This would clobber other people's changes.
  socket.emit('update:meeting:comments', $scope.meeting.comments);
 };

 socket.on('update:meeting:comments', function(data){
   $scope.meeting.comments=data;
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
  socket.on('highlight:selected:row', function(comment){
  for(var j=0; j<$scope.meeting.comments.length ; j++){
    if($scope.meeting.comments[j].status == comment.status){
        $scope.meeting.comments[j] = comment;
    }else{
     $scope.meeting.comments[j].selected = '';
    }
  }
  });

  $scope.setSelected = function(comment) {
     comment.selected = 'selected';
     socket.emit('highlight:selected:row', comment);
  };
// End
}

function MergeCtrl($scope, $routeParams, socket, mtgDetails) {
    'use strict';



}
