'use strict';

/* App Module */

var app = angular.module('standup', ['standupFilters']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      //Removed temporarily while focusing on single meeting principle.
      //when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting.html', controller: MeetingCtrl}).
      //Removed temporarily while focusing on single meeting principle.
      //when('/new', {templateUrl: "partials/create.html", controller: CreateCtrl}).
      otherwise({redirectTo: '/meeting/vri'});
}]);
