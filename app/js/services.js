
/* Services */
(function(services){
  services.factory('socket', function ($rootScope, $location) {
    'use strict';
    var socket;
    var registeredEvents = [];

    var connect = function(){
          if(!socket){
            socket = io.connect('http://'+$location.host()+':5000');
          }
    };

    connect();

    var globalOn = function(eventName, callback){
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    };

    var registeredOn = function (eventName, callback) {
      var proxyFunction = function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      };
      registeredEvents.push({
        eventName: eventName,
        callback: proxyFunction
      });
      socket.on(eventName, proxyFunction);
    };

    var emitWrapper = function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                }
            });
      });
    };

    var cleanup = function(){
      registeredEvents.forEach(function(event, index){
        socket.removeListener(event.eventName, event.callback);
      });
    };

    return {
        global: globalOn,
        on: registeredOn,
        emit: emitWrapper,
        cleanup: cleanup
    };
  })

  services.factory('mtgDetails', function (){
    return {
      capture: {
        meeting:'',
        user:''
      },
      captureDetails: function(meeting, user){
        this.capture.meeting = angular.copy(meeting);
        this.capture.user = angular.copy(user);

      },
      getDetails: function(){
        var temp = this.capture;
        this.capture = {};
        return temp;
      }
    };
  });

  services.factory('timerService', function(socket, $timeout){
      return function($scope){
          var currentTimeout = {};
          var lastDuration;

          socket.global('timer:init', function(data){
            console.log(data.duration);
            lastDuration = moment.duration(data.duration);
            $scope.duration = lastDuration;
            console.log($scope.duration);
          });

          var startTimeout = function(timer){
              var onTimeout = function(){
                  timer.expired = moment().isAfter(timer.endTime);
                  if(timer.expired){
                      $scope.duration = lastDuration;
                  } else {
                      $scope.duration = timer.currentDuration();
                      currentTimeout = $timeout(onTimeout,1000);
                  }
              };
              currentTimeout = $timeout(onTimeout,1000);
          };

          var timer = {
              endTime: moment(),
              currentDuration: function(){
                return moment.duration(this.endTime.diff(moment()));
              },
              start: function(duration){
                  socket.emit('timer:start',{
                      duration:duration
                  });
              },

              stop: function(){
                  $scope.duration = lastDuration;
                  $timeout.cancel(currentTimeout);
                  timer.expired = true;
                  socket.emit('timer:stop',{});
              },

              expired: true
          };

          socket.global('timer:start', function(data){
              $timeout.cancel(currentTimeout);
              timer.endTime = moment().add(data.duration);
              lastDuration = moment.duration(data.duration);
              startTimeout(timer);
              timer.expired = false;
          });

          socket.global('timer:stop', function(){
              if(!timer.expired){
                  timer.stop();
              }
          });

          return timer;
      };
  });

})(angular.module('services',[]));

function Meeting(name, startTime){
	this.name = name;
	this.startTime = new Date(startTime);
	this.available = false;
	this.durationMinutes = 15;
}
