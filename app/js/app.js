

/* App Module */
var app = angular.module('lean-coffee', ['filters','services']).
  config(function($routeProvider) {
  'use strict';
  $routeProvider.
      when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting.html', controller: MeetingCtrl}).
      when('/snapshot', {templateUrl: "partials/snapshot.html", controller: SnapshotCtrl}).
      otherwise({redirectTo: '/home'});
});
