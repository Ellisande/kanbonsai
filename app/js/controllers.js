'use strict';

/* Controllers */
function MeetingListCtrl($scope, socket){
    socket.connect();
    socket.on('meetings:update', function(meetings){
       $scope.meetings = meetings.meetings;
    });
    $scope.leave = function(){
        socket.emit('unsubscribe');
    }
}

function HomeCtrl($scope, $location, socket) {
    socket.connect();
    $scope.create = function(){
        $location.url('/meeting/'+$scope.meetingName);
    }
}

function TimerCtrl($scope, timerService){
    $scope.duration = moment.duration(0);
    $scope.timer = timerService($scope);
    $scope.start = function(){
//        $scope.timer.start(180000);
        $scope.timer.start(20000);
    };
    console.log($scope.duration);
    $scope.stop = function(){
        $scope.timer.stop();
    }
}

function SnapshotCtrl($scope, snapshot){
	var meeting = snapshot.get();
    $scope.snapshot = {};
	$scope.snapshot.comments = meeting;
    $scope.snapshot.commentOrder = '-voters.length';
}

function MeetingCtrl($scope, $routeParams, socket, snapshot, $location) {
	socket.connect($routeParams.meetingName);
    socket.emit('unsubscribe');
    socket.emit('subscribe', {name: $routeParams.meetingName});
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
        console.log('Posting a comment');
		$scope.meeting.comments.push(data.comment);
	});

	socket.on('user:left', function(data){
        if($scope.meeting === undefined){return;}
		var userToRemove = data.user;
		var allUsers = $scope.meeting.participants;
        allUsers.forEach(function(user){
            if(userToRemove === user){
                allUsers.splice(allUsers.indexOf(user),1);
            }
        });
		for(var i = 0; i < allUsers.length; i++){
			if(allUsers[i] === userToRemove){
				allUsers.splice(i,1);
			}
		}

		var comments = $scope.meeting.comments;
        var totalComments = $scope.meeting.comments.length;
		for(var i = 0; i < totalComments; i++){
			if(comments[i].author == userToRemove){
				comments.splice(i,1);
                i--;
                totalComments--;
				continue;
			}
            
            var totalVoters = comments[i].voters.length;
            for(var j = 0; j < totalVoters; j++){
                if(comments[i].voters[j] === userToRemove){
                    comments[i].voters.splice(j,1);
                    j--;
                    totalVoters--;
                }
            }
		}
	});

	socket.on('comment:vote', function(data){
		var allComments = $scope.meeting.comments;
		for(var i = 0; i < allComments.length; i++){
			if(allComments[i].author === data.comment.author && allComments[i].status === data.comment.status){
                allComments[i] = data.comment;        
            }
		}
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
        socket.disconnect();
        $location.url('snapshot');
	};

	function Comment(author){
		this.status = '';
		this.voters = [];
		this.author = author;
		this.votes = function(){return this.voters.length};
	}
} 
