'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
app
.factory('socket', function ($rootScope) {
  var socket;
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
    connect: function(meetingName){
//      socket = io.connect('http://www.ellisande.com:3000/');
      socket = io.connect('http://localhost:3000/');
    }
  };
}).
factory('snapshot', function (){
  return {
    capture: {},
    grab: function(meeting){
      console.log("In the service:");
      console.log(meeting);
      for (var attr in meeting) {
        if (meeting.hasOwnProperty(attr)) this.capture[attr] = meeting[attr];
        for(var subAttr in meeting[attr]){
            if(meeting[attr].hasOwnProperty(subAttr)) this.capture[attr][subAttr] = meeting[attr][subAttr];
        }
      }
    },
    get: function(){
      console.log("On the retrieve");
      console.log(this.capture);
      var temp = this.capture;
      this.capture = {};
      return temp;
    }
  };
});

function Meeting(name, startTime){
	this.name = name;
	this.startTime = new Date(startTime);
	this.available = false;
	this.durationMinutes = 15;
}
