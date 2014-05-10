

/* App Module */
var app = angular.module('lean-coffee', ['filters','services','directives']).
  config(function($routeProvider) {
  'use strict';
  $routeProvider.
      when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting-main.html', controller: MeetingCtrl}).
      otherwise({redirectTo: '/home'});
});
