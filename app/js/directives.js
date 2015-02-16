angular.module('directives', [])
 .directive('toggleHost', function() {
      return {
        restrict: 'E',
        controller: function($scope, socket){
            $scope.becomeHost = function(){
                $scope.user.isHost =!$scope.user.isHost;
                socket.emit('host:toggle', $scope.user);
            };

          socket.on('host:toggled', function(userData){
           for(var k=0; k <$scope.meeting.participants.length; k++){
                if($scope.meeting.participants[k].name == userData.name){
                 $scope.meeting.participants[k].isHost=  userData.isHost;
                }
           }

         });
        },
        templateUrl: 'partials/be-the-host.html',
    };
  })
  .directive('currentUser', function() {
    return {
      restrict: 'E',
      template: '<span>You are: {{user.name}} </span>'
    };
  })
  .directive('meetingMenu', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/meeting-menu.html'
    };
  });
