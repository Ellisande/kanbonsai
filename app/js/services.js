
/* Services */
angular.module('services', [])
.factory('socket', function ($rootScope, $location) {
    'use strict';
    var socket;
    var registeredEvents = [];

    var connect = function(){
          if(!socket){
            socket = io.connect('http://'+$location.host()+':5000');
          }
    };

    connect();

    return {
        global: function(eventName, callback){
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        on: function (eventName, callback) {
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
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                    }
                });
          });
        },
        cleanup: function(){
          registeredEvents.forEach(function(event, index){
            socket.removeListener(event.eventName, event.callback);
          });
        }
    };
}).
factory('snapshot', function (){
  return {
    capture: {},
    grab: function(meeting){
      this.capture = angular.copy(meeting);
    },
    get: function(){
      var temp = this.capture;
      this.capture = {};
      return temp;
    }
  };
}).
factory('mtgDetails', function (){
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
}).
factory('timerService', function(socket, $timeout){
    return function($scope){
        $scope.duration = moment.duration(3, 'minutes');
        var currentTimeout = {};

        var startTimeout = function(timer){
            var onTimeout = function(){
                timer.expired = moment().isAfter(timer.endTime);
                if(timer.expired){
                    $scope.duration = moment.duration(3, 'minutes');
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
                $scope.duration = moment.duration(3,'minutes');
                $timeout.cancel(currentTimeout);
                timer.expired = true;
                socket.emit('timer:stop',{});
            },

            expired: true
        };

        socket.on('timer:start', function(data){
            $timeout.cancel(currentTimeout);
            timer.endTime = moment().add(data.duration, 'milliseconds');
            startTimeout(timer);
            timer.expired = false;
        });

        socket.on('timer:stop', function(){
            if(!timer.expired){
                timer.stop();
            }
        });
        return timer;
    };
}).factory('localTimer', function($timeout){
    return function($scope){
        $scope.duration = moment.duration(3, 'minutes');
        var currentTimeout = {};

        var startTimeout = function(timer){
            var onTimeout = function(){
                timer.expired = moment().isAfter(timer.endTime);
                if(timer.expired){
                    $scope.duration = moment.duration(3, 'minutes');
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
                $timeout.cancel(currentTimeout);
                timer.endTime = moment().add(duration, 'milliseconds');
                startTimeout(timer);
                timer.expired = false;
            },

            stop: function(){
                $scope.duration = moment.duration(3,'minutes');
                $timeout.cancel(currentTimeout);
                timer.expired = true;
                socket.emit('timer:stop',{});
            },

            expired: true
        };

        return timer;
      };
});

function Meeting(name, startTime){
	this.name = name;
	this.startTime = new Date(startTime);
	this.available = false;
	this.durationMinutes = 15;
}
