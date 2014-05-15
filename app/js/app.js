

/* App Module */
var app = angular.module('lean-coffee', ['filters','services','directives','LocalStorageModule']).
  config(function($routeProvider, localStorageServiceProvider) {
  'use strict';
  localStorageServiceProvider.setPrefix('leanCoffee');
  localStorageServiceProvider.setStorageType('sessionStorage');
  $routeProvider.
      when('/home', {templateUrl: 'partials/home.html',   controller: HomeCtrl}).
      when('/meeting/:meetingName', {templateUrl: 'partials/meeting-main.html', controller: MeetingCtrl}).
      otherwise({redirectTo: '/home'});
});
