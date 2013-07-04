'use strict';

/* Controllers */

function HomeCtrl($scope, $http) {
  $http.get('meetings/meetings.json').success(function(data) {
    $scope.meetings = data;
  });

  $scope.orderProp = '-available';
}

//PhoneListCtrl.$inject = ['$scope', '$http'];
function NavCtrl($scope, MeetingService){
	$scope.meetings = MeetingService.all;
}

function CreateCtrl($scope, MeetingService){
	$scope.meeting = new Meeting();

	$scope.add = function(meeting){
		MeetingService.add(meeting, MeetingService.all);
		$scope.meeting = new Meeting();
	};
}

function MeetingCtrl($scope, $routeParams, $http, $timeout) {
	$scope.meetingName = $routeParams.meetingName;
	$scope.commentOrder = "-votes";
	$scope.upVote = function(comment){
		comment.votes++;
	}

	var isMeetingRunning = function(startTime, currentTime, endTime){
		if(startTime < currentTime < endTime){
			return true;
		}

		return false;
	};

	var countDownTime = function(currentTime, endTime){
		return new Date(endTime.getTime() - currentTime.getTime());
	};

	var ifMeetingRunningReturnCountdown = function(startTime, currentTime, endTime){
		if(isMeetingRunning(startTime, new Date(), endTime)){
			return countDownTime(new Date(), endTime);
		} else{
			$scope.stop;
			return new Date(0);
		}
	}

	$http.get('meetings/meeting.json').success(function(data){
	  	$scope.meeting = data;
	  	$scope.meeting.startTime = new Date($scope.meeting.startTime);
	});


} 

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];
