'use strict';

/* App Module */

angular.module('standup', ['standupFilters','standupServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting.html', controller: MeetingCtrl}).
      when('/new', {templateUrl: "partials/create.html", controller: CreateCtrl}).
      otherwise({redirectTo: '/home'});
}]);
