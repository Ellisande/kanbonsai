

/* App Module */
var app = angular.module('lean-coffee', ['filters','services','directives']).
  config(function($routeProvider) {
  'use strict';
  $routeProvider.
      when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting-new.html', controller: MeetingCtrl}).
      when('/merge', {templateUrl: 'partials/merge.html', controller: MergeCtrl}).
      when('/snapshot', {templateUrl: "partials/snapshot.html", controller: SnapshotCtrl}).
      otherwise({redirectTo: '/home'});
});
