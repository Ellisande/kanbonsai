angular.module('directives', [])
 .directive('toggleHost', function() {
      return {
        restrict: 'E',
        controller: function($scope, socket){
            $scope.becomeHost = function(){
                console.log("it's called previous : "+ $scope.user.isHost);
                //$scope.user.isHost=!$scope.user.isHost;
                $scope.user.isHost =!$scope.user.isHost;
                socket.emit('host:toggle', $scope.user);
            };

         socket.on('host:toggled', function(userData){

         console.log(" > Called host:toggled now : "+ $scope.user.name +" host : "+$scope.user.isHost);
          // for(var k=0; k <$scope.meeting.participants.length; k++){
          //      console.log($scope.meeting.participants[k]);
          // }

         });
        },
        templateUrl: 'partials/be-the-host.html',
    };
  })
  .directive('currentUser', function() {
    return {
      restrict: 'E',
      template: '<h2>You are: {{user.name}}</h2>'
    };
  })
  .directive('meetingMenu', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/meeting-menu.html'
    };
  });
