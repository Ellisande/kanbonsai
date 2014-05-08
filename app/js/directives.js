angular.module('directives', [])
 .directive('toggleHost', function() {
      return {
        restrict: 'E',
        controller: function($scope, socket){
            $scope.becomeHost = function(){
                //console.log("it's called "+ $scope.user);
                socket.emit('host:toggle', {
                    name: $scope.user
                });
            };

         socket.on('host:toggle', function(data){
         console.log(" > Called host:toggle : "+$scope.meeting.participants.length);
          for(var k=0; k <$scope.meeting.participants.length; k++){
               console.log($scope.meeting.participants[k]);
          }

         });
        },
        templateUrl: 'partials/be-the-host.html',
    };
   });
