

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

function MeetingCtrl($scope, $routeParams, socket, snapshot, $location) {
    'use strict';
//	socket.connect($routeParams.meetingName);
    socket.emit('unsubscribe');
    socket.emit('subscribe', {
        name: $routeParams.meetingName
    });
    
	$scope.commentOrder = '-voters.length';
	$scope.userComment = new Comment();
	socket.on('init', function (data) 
	{
        $scope.user = data.user;
        $scope.meeting = data.meeting;
	});

	socket.on('user:join', function(data){
		$scope.meeting.participants.push(data.user);
	});

	socket.on('comment:post', function(data){
        console.log('Got a comment');
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
		commentToPost.author = $scope.user;
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
} 
